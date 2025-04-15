using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class SupportRequestRepository : ISupportRequestRepository
    {
        public async Task AddSupportRequestAsync(SupportRequest SupportRequest) => await SupportRequestDAO.Instance.AddSupportRequestAsync(SupportRequest);

        public async Task DeleteSupportRequestAsync(int id) => await SupportRequestDAO.Instance.DeleteSupportRequestAsync(id);

        public async Task<List<SupportRequest>> GetAllPendingSupportRequestsAsync(int pageNumber, int pageSize) => await SupportRequestDAO.Instance.GetAllPendingSupportRequestsAsync(pageNumber, pageSize);

        public async Task<List<SupportRequest>> GetAllSupportRequestsAsync(int pageNumber, int pageSize) => await SupportRequestDAO.Instance.GetAllSupportRequestsAsync(pageNumber, pageSize);

        public async Task<SupportRequest> GetSupportRequestByIDAsync(int uID) => await SupportRequestDAO.Instance.GetSupportRequestByIDAsync(uID);

        public async Task<List<SupportRequest>> GetSupportRequestByUserAsync(int id, int pageNumber, int pageSize) => await SupportRequestDAO.Instance.GetSupportRequestByUserAsync(id, pageNumber, pageSize);

        public async Task UpdateSupportRequestAsync(SupportRequest SupportRequest) => await SupportRequestDAO.Instance.UpdateSupportRequestAsync(SupportRequest);
    }
}
