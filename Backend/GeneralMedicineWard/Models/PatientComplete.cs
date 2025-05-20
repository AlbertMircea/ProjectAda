using Microsoft.Identity.Client;

namespace DotnetAPI.Models
{
    public partial class PatientComplete
    {

        public int UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Gender { get; set; }

        public bool Active { get; set; }
        public int DoctorID { get; set; }
        public string Ward { get; set; }

        public string Room { get; set; }

        public int MedicationId { get; set; }

        public string Medication { get; set; }
        public string Dosage { get; set; }

        public int Quantity { get; set; }

        public PatientComplete()
        {
            if (FirstName == null)
                FirstName = "";

            if (LastName == null)
                LastName = "";

            if (Email == null)
                Email = "";

            if (Gender == null)
                Gender = "";

            if (Ward == null)
                Ward = "";

            if (Room == null)
                Room = "";

            if (Medication == null)
                Medication = "";

            if (Dosage == null)
                Dosage = "";
                
        }


    }
}