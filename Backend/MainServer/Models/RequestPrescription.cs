namespace DotnetAPI.Models
{
    public class RequestPrescription
    {
        public int RequestId { get; set; }
        
        public int PatientId { get; set; }
        
        public int NurseId { get; set; }
        
        public int MedicationId { get; set; }

        public string Status { get; set; }

        public int Quantity { get; set; }

        public RequestPrescription()
        {
            if (Status == null)
            {
                Status = "";
            }
        }
    }

}
