namespace IGSPharma.Infrastructure.Settings
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public bool EnableSsl { get; set; }
        public string WebsiteBaseUrl { get; set; }
    }
}
