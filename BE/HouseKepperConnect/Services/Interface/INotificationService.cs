using BusinessObject.Models;

namespace Services.Interface
{
    public interface INotificationService
    {
        Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize);

        Task<Notification> GetNotificationByIDAsync(int id);

        Task<int> GetTotalNotisAsync();

        Task<List<Notification>> GetNotificationsByUserAsync(int uId, int pageNumber, int pageSize);

        Task AddNotificationAsync(Notification noti);

        Task DeleteNotificationAsync(int id);

        Task UpdateNotificationAsync(Notification noti);
    }
}