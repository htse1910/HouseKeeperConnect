using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;

namespace BusinessObject.DTO
{
    public class PaymentIDisplayDTO
    {
        public int PaymentID { get; set; }
        public int JobID { get; set; }
        public string JobName { get; set; }
        public List<Service> Services { get; set; }
        public int HousekeeperID { get; set; }
        public string Avatar {  get; set; }
        public string Nickname { get; set; }

        public decimal Amount { get; set; }
        public decimal Commission { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; }
    }
}
