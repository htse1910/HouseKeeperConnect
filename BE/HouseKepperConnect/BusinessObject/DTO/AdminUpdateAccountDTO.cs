using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class AdminUpdateAccountDTO
    {

        [Required]
        public int AccountID { get; set; }



        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }



        [Required(ErrorMessage = "Phone is required.")]
        public int Status { get; set; }
    }
}
