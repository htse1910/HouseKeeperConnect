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
    public class ChatRepository : IChatRepository
    {
        public async Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId) => await ChatDAO.Instance.GetChatsBetweenUsersAsync(fromAccountId, toAccountId);
        public async Task ChatAsync(Chat chat) => await ChatDAO.Instance.ChatAsync(chat);   
    }
}
