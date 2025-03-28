using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class JobDisplayDTO
    {
        public int JobID { get; set; }

        public int FamilyID { get; set; }
        public string JobName { get; set; }

        public int Status { get; set; }
        public int JobType { get; set; }
        public string Location { get; set; }
        public decimal Price { get; set; }
    }
}
