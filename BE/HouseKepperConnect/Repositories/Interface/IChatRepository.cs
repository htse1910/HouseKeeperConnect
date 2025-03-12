using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IChatRepository
    {
        Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId);
        Task ChatAsync(Chat chat);
    }
}
