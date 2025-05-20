namespace DotnetAPI.Models
{
    public class Prescription
    {
        public int MedicationId { get; set; }
        public string Medication { get; set; }
        public string Dosage { get; set; }
        public int Quantity { get; set; }
        public int UserId { get; set; }
    
            public Prescription()
        {
            if (Medication == null)
            {
                Medication = "";
            }
            if (Dosage == null)
            {
                Dosage = "";
            }
        }
}

}