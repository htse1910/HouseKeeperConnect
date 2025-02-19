using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Job
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobID { get; set; }
        public int AccountID { get; set; }
        public string JobName { get; set; }
        public int Status { get; set; }

        public virtual Account Account { get; set; }
    }
}
