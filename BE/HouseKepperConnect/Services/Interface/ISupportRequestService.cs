using BusinessObject.Models;

namespace Services.Interface
{
    public interface ISupportRequestService
    {
        Task<List<SupportRequest>> GetAllSupportRequestsAsync(int pageNumber, int pageSize);

        Task<List<SupportRequest>> GetAllPendingSupportRequestsAsync(int pageNumber, int pageSize);

        Task<SupportRequest> GetSupportRequestByIDAsync(int uID);

        Task<List<SupportRequest>> GetSupportRequestByUserAsync(int id, int pageNumber, int pageSize);

        Task AddSupportRequestAsync(SupportRequest SupportRequest);

        Task DeleteSupportRequestAsync(int id);

        Task UpdateSupportRequestAsync(SupportRequest SupportRequest);
    }
}