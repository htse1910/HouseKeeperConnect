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
    public class PayoutDisplayDTO
    {
        public int PayoutID { get; set; }
        public int FamilyID { get; set; }
        public string Nickname { get; set; }
        public int JobID { get; set; }
        public int JobName { get; set; }
        public List<Service> services { get; set; } 
        public decimal Amount { get; set; }
        public DateTime PayoutDate { get; set; } = DateTime.Now;
        public int Status { get; set; }
    }
}
