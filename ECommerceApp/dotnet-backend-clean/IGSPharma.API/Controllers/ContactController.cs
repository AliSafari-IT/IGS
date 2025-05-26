using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using IGSPharma.Application.DTOs;
using IGSPharma.Application.Interfaces;
using IGSPharma.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IGSPharma.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IEmailService emailService, ILogger<ContactController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ContactMessageDto message)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Build email content
                string subject = $"Contact Form: {message.Subject}";
                string emailBody =
                    $@"<h2>New Contact Form Submission</h2>
                    <p><strong>From:</strong> {message.Name} ({message.Email})</p>
                    <p><strong>Subject:</strong> {message.Subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>{message.Message}</p>";

                // Get admin email from settings (using SenderEmail as recipient for simplicity)
                var contactEmail = await _emailService.GetIGSContactEmailAsync();

                // Send the email
                await _emailService.SendEmailAsync(contactEmail, subject, emailBody);

                _logger.LogInformation("Contact form submitted by {Email}", message.Email);
                return Ok(new { message = "Your message has been received. Thank you!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error sending contact form email from {Email}",
                    message.Email
                );
                return StatusCode(
                    500,
                    new { message = "Failed to send your message. Please try again later." }
                );
            }
        }
    }
}
