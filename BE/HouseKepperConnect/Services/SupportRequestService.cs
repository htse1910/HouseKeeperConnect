using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class SupportRequestService : ISupportRequestService
    {
        private readonly ISupportRequestRepository _repository;

        public SupportRequestService(ISupportRequestRepository repository)
        {
            _repository = repository;
        }

        public async Task AddSupportRequestAsync(SupportRequest SupportRequest) => await _repository.AddSupportRequestAsync(SupportRequest);

        public async Task DeleteSupportRequestAsync(int id) => await _repository.DeleteSupportRequestAsync(id);

        public async Task<List<SupportRequest>> GetAllPendingSupportRequestsAsync(int pageNumber, int pageSize) => await _repository.GetAllPendingSupportRequestsAsync(pageNumber, pageSize);

        public async Task<List<SupportRequest>> GetAllSupportRequestsAsync(int pageNumber, int pageSize) => await _repository.GetAllSupportRequestsAsync(pageNumber, pageSize);

        public async Task<SupportRequest> GetSupportRequestByIDAsync(int uID) => await _repository.GetSupportRequestByIDAsync(uID);

        public async Task<List<SupportRequest>> GetSupportRequestByUserAsync(int id, int pageNumber, int pageSize) => await _repository.GetSupportRequestByUserAsync(id, pageNumber, pageSize);

        public async Task UpdateSupportRequestAsync(SupportRequest SupportRequest) => await _repository.UpdateSupportRequestAsync(SupportRequest);
    }
}