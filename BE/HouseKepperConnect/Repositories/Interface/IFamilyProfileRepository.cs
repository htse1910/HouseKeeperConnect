using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IFamilyProfileRepository
    {
        Task<List<Family>> GetAllFamilysAsync(int pageNumber, int pageSize);

        Task<Family> GetFamilyByIDAsync(int fID);

        Task AddFamilyAsync(Family Family);

        Task DeleteFamilyAsync(int id);

        Task UpdateFamilyAsync(Family Family);

        Task<List<Family>> SearchFamiliesByAccountIDAsync(int accountId);

        Task<Family> GetFamilyByAccountIDAsync(int accountId);
    }
}