using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IChatService
    {
        Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId);
        Task ChatAsync(Chat chat);
    }
}
