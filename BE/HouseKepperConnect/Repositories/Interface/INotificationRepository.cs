﻿using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize);

        Task<Notification> GetNotificationByIDAsync(int id);

        Task<int> GetTotalNotisByUserAsync(int id);

        Task<List<Notification>> GetNotificationsByUserAsync(int uId, int pageNumber, int pageSize);

        Task AddNotificationAsync(Notification noti);

        Task DeleteNotificationAsync(int id);

        Task UpdateNotificationAsync(Notification noti);
    }
}