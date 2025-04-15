using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface ISupportRequestRepository
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
