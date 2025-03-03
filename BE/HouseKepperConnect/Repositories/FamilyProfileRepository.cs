using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class FamilyProfileRepository : IFamilyProfileRepository
    {
        public async Task<List<Family>> GetAllFamilysAsync() => await FamilyProfileDAO.Instance.GetAllFamilysAsync();
        public async Task<Family> GetFamilyByIDAsync(int fID) => await FamilyProfileDAO.Instance.GetFamilyByIDAsync(fID);
        public async Task AddFamilyAsync(Family Family) => await FamilyProfileDAO.Instance.AddFamilyAsync(Family);
        public async Task DeleteFamilyAsync(int id) => await FamilyProfileDAO.Instance.DeleteFamilyAsync(id);
        public async Task UpdateFamilyAsync(Family Family) => FamilyProfileDAO.Instance.UpdateFamilyAsync(Family);
        public async Task<List<Family>> SearchFamilysByNameAsync(string name) => await FamilyProfileDAO.Instance.SearchFamilysByNameAsync(name);

    }
}
