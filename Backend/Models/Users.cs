using Microsoft.Identity.Client;

namespace DotnetAPI.Dtos
{
    public partial class User
    {
        public int UserId { get; set; }
        public string Email {get;set;}
        public byte[] PasswordHash {get;set;}
        public byte[] PasswordSalt {get;set;}
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Gender { get; set; }

        public string RoleWorker { get; set; }

        public User()
        {
            if(PasswordHash == null)
            {
                PasswordHash = new byte[0];
            }
            
            if(PasswordSalt == null)
            {
                PasswordSalt = new byte[0];
            }
            if (Email == null)
                Email = "";
            
            if (Email == null)
                Email = "";
                
            if (FirstName == null)
                FirstName = "";

            if (LastName == null)
                LastName = "";

            if (Gender == null)
                Gender = "";

            if (RoleWorker == null)
                RoleWorker = "";
            

        }

    }
}