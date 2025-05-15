using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace BusinessObject.Models
{
    public class FamilyPreference
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FamilyPreferenceID { get; set; }
        [ForeignKey("Family")]
        public int FamilyID { get; set; }
        public int GenderPreference {  get; set; }
        public int LanguagePreference {  get; set; }
        public int LocationPreference { get; set; }
        public virtual Family Family { get; set; }
    }
}
