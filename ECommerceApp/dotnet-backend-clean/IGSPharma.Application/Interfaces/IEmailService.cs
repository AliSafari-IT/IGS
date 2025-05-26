using System.Threading.Tasks;

namespace IGSPharma.Application.Interfaces
{
    public interface IEmailService
    {
        Task<string> GetIGSContactEmailAsync();

        Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
        Task SendPasswordResetEmailAsync(string email, string resetToken);
    }
}
