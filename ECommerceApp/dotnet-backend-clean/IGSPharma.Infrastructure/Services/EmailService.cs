using System;
using System.Globalization;
using System.Net;
using System.Net.Mail;
using System.Security;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using IGSPharma.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IGSPharma.Infrastructure.Services
{
    public class EmailService : IEmailService, IDisposable
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly SmtpClient _smtpClient;
        private bool _disposed = false;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration =
                configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            // Initialize SMTP client with settings from configuration
            _smtpClient = new SmtpClient
            {
                Host = _configuration["Smtp:Host"] ?? "smtp.hostinger.com",
                Port = _configuration.GetValue<int>("Smtp:Port", 587),
                EnableSsl = _configuration.GetValue<bool>("Smtp:EnableSsl", true),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Timeout = _configuration.GetValue<int>("Smtp:Timeout", 10000),
            };

            var username = _configuration["Smtp:Username"];
            var password = _configuration["Smtp:Password"];

            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                _smtpClient.Credentials = new NetworkCredential(username, password);
            }
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            if (string.IsNullOrWhiteSpace(to))
                throw new ArgumentException("Recipient email address cannot be empty", nameof(to));

            if (string.IsNullOrWhiteSpace(subject))
                throw new ArgumentException("Email subject cannot be empty", nameof(subject));

            if (string.IsNullOrWhiteSpace(body))
                throw new ArgumentException("Email body cannot be empty", nameof(body));

            try
            {
                var smtpSection = _configuration.GetSection("EmailSettings");
                var fromEmail =
                    smtpSection["SenderEmail"]
                    ?? throw new InvalidOperationException("Sender email is not configured");
                var fromName = smtpSection["SenderName"] ?? "IGS Pharma Support";

                _logger.LogInformation(
                    "Preparing to send email to {To} with subject: {Subject}",
                    to,
                    subject
                );

                using var message = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml,
                    Priority = MailPriority.Normal,
                };

                // Validate and add recipient
                try
                {
                    if (!IsValidEmail(to))
                        throw new FormatException($"Invalid email address format: {to}");

                    message.To.Add(new MailAddress(to));
                }
                catch (FormatException ex)
                {
                    _logger.LogError(ex, "Invalid email address format: {Email}", to);
                    throw new ArgumentException(
                        $"Invalid email address format: {to}",
                        nameof(to),
                        ex
                    );
                }

                _logger.LogInformation(
                    "Sending email to {To} using SMTP server {Host}:{Port}",
                    to,
                    _smtpClient.Host,
                    _smtpClient.Port
                );

                // Set a timeout for the entire operation
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                await _smtpClient.SendMailAsync(message, cts.Token);

                _logger.LogInformation("Email sent successfully to {To}", to);
            }
            catch (OperationCanceledException ex)
            {
                var errorMessage = "SMTP operation timed out while sending email";
                _logger.LogError(ex, "{ErrorMessage} to {To}", errorMessage, to);
                throw new TimeoutException($"{errorMessage}. Please try again later.", ex);
            }
            catch (SmtpException ex) when (ex.StatusCode == SmtpStatusCode.ServiceNotAvailable)
            {
                var errorMessage =
                    "SMTP service is not available. Please check your network connection and SMTP server status.";
                _logger.LogError(
                    ex,
                    "{ErrorMessage} (Server: {Host}:{Port})",
                    errorMessage,
                    _smtpClient.Host,
                    _smtpClient.Port
                );
                throw new ApplicationException(errorMessage, ex);
            }
            catch (SmtpException ex) when (ex.StatusCode == SmtpStatusCode.MustIssueStartTlsFirst)
            {
                var errorMessage =
                    "SMTP server requires a secure connection. Please enable SSL/TLS in the configuration.";
                _logger.LogError(ex, errorMessage);
                throw new SecurityException(errorMessage, ex);
            }
            catch (SmtpException ex) when (ex.StatusCode == SmtpStatusCode.ClientNotPermitted)
            {
                var errorMessage =
                    "SMTP authentication failed. The client is not permitted to send emails.";
                _logger.LogError(ex, errorMessage);
                throw new UnauthorizedAccessException(errorMessage, ex);
            }
            catch (SmtpException ex)
            {
                var errorMessage =
                    $"SMTP error while sending email. Status: {ex.StatusCode}, Error: {ex.Message}";
                _logger.LogError(ex, "{ErrorMessage} (To: {To})", errorMessage, to);
                throw new ApplicationException(errorMessage, ex);
            }
            catch (IOException ex)
            {
                var errorMessage =
                    "Network error while sending email. Please check your internet connection.";
                _logger.LogError(ex, "{ErrorMessage} (To: {To})", errorMessage, to);
                throw new ApplicationException(errorMessage, ex);
            }
            catch (Exception ex)
                when (ex is ObjectDisposedException || ex is InvalidOperationException)
            {
                var errorMessage =
                    "SMTP client is in an invalid state. The email service may have been disposed.";
                _logger.LogError(ex, "{ErrorMessage} (To: {To})", errorMessage, to);
                throw new InvalidOperationException(errorMessage, ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while sending email to {To}", to);
                throw new ApplicationException(
                    "An unexpected error occurred while sending the email. Please try again later.",
                    ex
                );
            }
        }

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Normalize the domain
                email = Regex.Replace(
                    email,
                    @"(@)(.+)$",
                    DomainMapper,
                    RegexOptions.None,
                    TimeSpan.FromMilliseconds(200)
                );

                // Return true if email is in valid format
                return Regex.IsMatch(
                    email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase,
                    TimeSpan.FromMilliseconds(250)
                );
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
            catch (ArgumentException)
            {
                return false;
            }
        }

        private static string DomainMapper(Match match)
        {
            // Use IdnMapping class to convert Unicode domain names.
            var idn = new IdnMapping();

            // Pull out and process domain name (throws ArgumentException on invalid)
            string domainName = idn.GetAscii(match.Groups[2].Value);

            return match.Groups[1].Value + domainName;
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            if (string.IsNullOrWhiteSpace(resetToken))
                throw new ArgumentException("Reset token cannot be empty", nameof(resetToken));

            try
            {
                var smtpSection = _configuration.GetSection("EmailSettings");
                // Use the frontend URL for password reset links
                var baseUrl =
                    smtpSection["FrontendBaseUrl"]?.TrimEnd('/') ?? "http://localhost:3000";

                var resetUrl =
                    $"{baseUrl}/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(resetToken)}";
                var subject = "Wachtwoord opnieuw instellen - IGS Pharma";

                // HTML email template with improved styling and email client compatibility
                var body = "";

                // Build the HTML content in parts to avoid escaping issues
                body += "<!DOCTYPE html>\n";
                body += "<html>\n";
                body += "<head>\n";
                body +=
                    "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n";
                body +=
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
                body += $"    <title>{WebUtility.HtmlEncode(subject)}</title>\n";
                body += "    <style type=\"text/css\">\n";
                body += "        /* Base styles */\n";
                body += "        body, html {\n";
                body += "            margin: 0 !important;\n";
                body += "            padding: 0 !important;\n";
                body += "            height: 100% !important;\n";
                body += "            width: 100% !important;\n";
                body += "            font-family: Arial, sans-serif;\n";
                body += "            line-height: 1.6;\n";
                body += "            color: #333333;\n";
                body += "            background-color: #f5f5f5;\n";
                body += "        }\n";
                body += "        /* Reset styles for email clients */\n";
                body += "        .ExternalClass {\n";
                body += "            width: 100%;\n";
                body += "        }\n";
                body +=
                    "        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\n";
                body += "            line-height: 100%;\n";
                body += "        }\n";
                body += "        /* Container */\n";
                body += "        .container {\n";
                body += "            max-width: 600px;\n";
                body += "            margin: 0 auto;\n";
                body += "            padding: 20px;\n";
                body += "            background-color: #ffffff;\n";
                body += "            border-radius: 8px;\n";
                body += "            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n";
                body += "        }\n";
                body += "        /* Header */\n";
                body += "        .header {\n";
                body += "            padding: 20px 0;\n";
                body += "            text-align: center;\n";
                body += "            border-bottom: 1px solid #eeeeee;\n";
                body += "        }\n";
                body += "        .header h2 {\n";
                body += "            color: #2c3e50;\n";
                body += "            margin: 0;\n";
                body += "            font-size: 24px;\n";
                body += "            line-height: 1.3;\n";
                body += "        }\n";
                body += "        /* Content */\n";
                body += "        .content {\n";
                body += "            padding: 20px 0;\n";
                body += "        }\n";
                body += "        .content p {\n";
                body += "            margin: 0 0 15px 0;\n";
                body += "            padding: 0;\n";
                body += "        }\n";
                body += "        /* Button */\n";
                body += "        .button-container {\n";
                body += "            text-align: center;\n";
                body += "            margin: 25px 0;\n";
                body += "        }\n";
                body += "        .button {\n";
                body += "            display: inline-block;\n";
                body += "            padding: 12px 25px;\n";
                body += "            background-color: #4CAF50;\n";
                body += "            color: #ffffff !important;\n";
                body += "            text-decoration: none;\n";
                body += "            border-radius: 4px;\n";
                body += "            font-weight: 500;\n";
                body += "            font-size: 16px;\n";
                body += "            line-height: 1.5;\n";
                body += "            mso-padding-alt: 0;\n";
                body += "        }\n";
                body += "        /* Reset link */\n";
                body += "        .reset-link {\n";
                body += "            word-break: break-all;\n";
                body += "            font-size: 14px;\n";
                body += "            color: #555555;\n";
                body += "            background-color: #f9f9f9;\n";
                body += "            padding: 15px;\n";
                body += "            border-radius: 4px;\n";
                body += "            overflow-wrap: break-word;\n";
                body += "            border-left: 4px solid #4CAF50;\n";
                body += "            margin: 20px 0;\n";
                body += "        }\n";
                body += "        /* Footer */\n";
                body += "        .footer {\n";
                body += "            margin-top: 30px;\n";
                body += "            padding-top: 20px;\n";
                body += "            border-top: 1px solid #eeeeee;\n";
                body += "            font-size: 14px;\n";
                body += "            color: #666666;\n";
                body += "            text-align: center;\n";
                body += "        }\n";
                body += "        .footer p {\n";
                body += "            margin: 0 0 10px 0;\n";
                body += "        }\n";
                body += "        .disclaimer {\n";
                body += "            font-size: 12px;\n";
                body += "            color: #999999;\n";
                body += "            margin-top: 20px !important;\n";
                body += "        }\n";
                body += "        /* Responsive */\n";
                body += "        @media only screen and (max-width: 600px) {\n";
                body += "            .container {\n";
                body += "                width: 100% !important;\n";
                body += "                margin: 0 !important;\n";
                body += "                border-radius: 0 !important;\n";
                body += "            }\n";
                body += "            .button {\n";
                body += "                width: 100% !important;\n";
                body += "                box-sizing: border-box;\n";
                body += "            }\n";
                body += "        }\n";
                body += "    </style>\n";
                body += "</head>\n";
                body += "<body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif;\">\n";
                body += "    <!-- Email wrapper -->\n";
                body +=
                    "    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"background-color: #f5f5f5;\">\n";
                body += "        <tr>\n";
                body +=
                    "            <td align=\"center\" valign=\"top\" style=\"padding: 20px 10px;\">\n";
                body += "                <!-- Main content -->\n";
                body +=
                    "                <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n";
                body += "                    <tr>\n";
                body +=
                    "                        <td class=\"container\" style=\"padding: 20px; background: #ffffff; border-radius: 8px;\">\n";
                body += "                            <!-- Header -->\n";
                body += "                            <div class=\"header\">\n";
                body += "                                <h2>Wachtwoord opnieuw instellen</h2>\n";
                body += "                            </div>\n";
                body += "                            \n";
                body += "                            <!-- Content -->\n";
                body += "                            <div class=\"content\">\n";
                body += "                                <p>Beste klant,</p>\n";
                body +=
                    "                                <p>We hebben een verzoek ontvangen om het wachtwoord voor uw IGS Pharma account opnieuw in te stellen. Klik op de onderstaande knop om door te gaan:</p>\n";
                body += "                                \n";
                body += "                                <div class=\"button-container\">\n";
                body +=
                    $"                                    <a href=\"{WebUtility.HtmlEncode(resetUrl)}\" class=\"button\" target=\"_blank\">Wachtwoord opnieuw instellen</a>\n";
                body += "                                </div>\n";
                body += "                                \n";
                body +=
                    "                                <p>Als u dit verzoek niet heeft gedaan, kunt u deze e-mail veilig negeren. Uw wachtwoord zal niet worden gewijzigd.</p>\n";
                body += "                                \n";
                body +=
                    "                                <p><strong>Let op:</strong> Deze link is 24 uur geldig.</p>\n";
                body += "                                \n";
                body +=
                    "                                <p>Werkt de knop niet? Kopieer en plak dan onderstaande link in uw browser:</p>\n";
                body += "                                \n";
                body += "                                <div class=\"reset-link\">\n";
                body += $"                                    {WebUtility.HtmlEncode(resetUrl)}\n";
                body += "                                </div>\n";
                body += "                            </div>\n";
                body += "                            \n";
                body += "                            <!-- Footer -->\n";
                body += "                            <div class=\"footer\">\n";
                body +=
                    "                                <p>Met vriendelijke groet,<br><strong>Het IGS Pharma team</strong></p>\n";
                body += "                                <p class=\"disclaimer\">\n";
                body +=
                    "                                    Dit is een automatisch bericht. Gelieve niet te reageren op deze e-mail.\n";
                body += "                                </p>\n";
                body +=
                    $"                                <p>&copy; {DateTime.Now.Year} IGS Pharma. Alle rechten voorbehouden.</p>\n";
                body += "                            </div>\n";
                body += "                        </td>\n";
                body += "                    </tr>\n";
                body += "                </table>\n";
                body += "            </td>\n";
                body += "        </tr>\n";
                body += "    </table>\n";
                body += "</body>\n";
                body += "</html>";
                ;

                await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in SendPasswordResetEmailAsync for {email}");
                throw; // Re-throw to be handled by the caller
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _smtpClient?.Dispose();
                }
                _disposed = true;
            }
        }

        ~EmailService()
        {
            Dispose(false);
        }
    }
}
