using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IFamilyProfileService
    {
        Task<List<Family>> GetAllFamilysAsync();
        Task<Family> GetFamilyByIDAsync(int fID);
        Task AddFamilyAsync(Family Family);
        Task DeleteFamilyAsync(int id);
        Task UpdateFamilyAsync(Family Family);
        Task<List<Family>> SearchFamilysByNameAsync(string name);
    }
}
