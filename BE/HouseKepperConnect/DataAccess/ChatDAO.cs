using AutoMapper;
using BusinessObject.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class ChatDAO
    {
        private static ChatDAO instance;
        private static readonly object instancelock = new object();

        private ChatDAO() { }

        public static ChatDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new ChatDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Chat
                        .Where(c => (c.FromAccountID == fromAccountId && c.ToAccountID == toAccountId) ||
                                    (c.FromAccountID == toAccountId && c.ToAccountID == fromAccountId))
                        .OrderBy(c => c.SendAt)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving chat history: " + ex.Message);
            }
        }

        public async Task ChatAsync(Chat chat)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Chat.Add(chat);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error saving chat message: " + ex.Message);
            }
        }
    }
}
