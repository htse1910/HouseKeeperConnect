﻿using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BusinessObject.DTO
{
    public class HouseKeeperUpdateDTO
    {
        public int AccountID { get; set; }

        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public int WorkType { get; set; }

        public IFormFile LocalProfilePicture { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string? BankAccountNumber { get; set; }

        public string? Introduction { get; set; }
        public string Address { get; set; }
        public int Gender { get; set; }
        public string Nickname { get; set; }
    }
}