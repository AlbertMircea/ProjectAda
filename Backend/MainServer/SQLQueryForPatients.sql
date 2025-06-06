
CREATE SCHEMA TutorialAppSchema;
GO

CREATE TABLE TutorialAppSchema.Patients
(
    UserId INT IDENTITY(1, 1) PRIMARY KEY
    , FirstName NVARCHAR(50)
    , LastName NVARCHAR(50)
    , Email NVARCHAR(50)
    , Gender NVARCHAR(10)
    , Active BIT
    , DoctorID INT
    , Ward NVARCHAR(30)
    , Room NVARCHAR(5)
);
GO


CREATE TABLE TutorialAppSchema.Medication
(
    MedicationId INT IDENTITY(1, 1) PRIMARY KEY
    , UserId INT
    , Medication NVARCHAR(50)
    , Dosage NVARCHAR(50)
    , Quantity INT
);
GO


CREATE OR ALTER PROCEDURE TutorialAppSchema.spPatient_Get
/*EXEC TutorialAppSchema.spPatient_Get @UserId=3*/
    @UserId INT = NULL
    , @Active BIT = NULL
AS
BEGIN

    SELECT [Patients].[UserId],
        [Patients].[FirstName],
        [Patients].[LastName],
        [Patients].[Email],
        [Patients].[Gender],
        [Patients].[Active],
        Patients.DoctorID,
        Patients.Ward,
        Patients.Room,
        Medication.Dosage,
        Medication.Quantity,
        Medication.Medication,
        Medication.MedicationId,
        Medication.UserId

    FROM TutorialAppSchema.Patients AS Patients 
        LEFT JOIN TutorialAppSchema.Medication AS Medication
            ON Patients.UserId = Medication.UserId
        WHERE Patients.UserId = ISNULL(@UserId, Patients.UserId)
            AND ISNULL(Patients.Active, 0) = COALESCE(@Active, Patients.Active, 0)
END
GO


CREATE OR ALTER PROCEDURE TutorialAppSchema.spPatient_Upsert
	@FirstName NVARCHAR(50),
	@LastName NVARCHAR(50),
	@Email NVARCHAR(50),
	@Gender NVARCHAR(10),
    @Active BIT = 1,
	@DoctorID INT,
	@Ward NVARCHAR(30),
    @Room NVARCHAR(5),
	@UserId INT = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM TutorialAppSchema.Patients WHERE UserId = @UserId)
        BEGIN
            INSERT INTO TutorialAppSchema.Patients(
                [FirstName],
                [LastName],
                [Email],
                [Gender],
                [Active],
                [DoctorID],
                [Ward],
                [Room]

            ) VALUES (
                @FirstName,
                @LastName,
                @Email,
                @Gender,
                @Active,
                @DoctorID,
                @Ward,
                @Room
            )
        END
    ELSE 
        BEGIN
            UPDATE TutorialAppSchema.Patients 
                SET FirstName = @FirstName,
                    LastName = @LastName,
                    Email = @Email,
                    Gender = @Gender,
                    Active = @Active,
                    DoctorID = @DoctorID,
                    Ward = @Ward,
                    Room = @Room
                WHERE UserId = @UserId
        END
END


GO

CREATE OR ALTER PROCEDURE TutorialAppSchema.spMedication_Upsert
    @Medication NVARCHAR(50),
    @Dosage NVARCHAR(50),
    @Quantity INT,
	@UserId INT = NULL,
    @MedicationId INT = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM TutorialAppSchema.Medication WHERE MedicationId = @MedicationId)
        BEGIN
            INSERT INTO TutorialAppSchema.Medication(
                [UserId],
                [Medication],
                [Dosage],
                [Quantity]
            ) VALUES (
                @UserId,
                @Medication,
                @Dosage,
                @Quantity

            )
        END
    ELSE 
        BEGIN
            UPDATE TutorialAppSchema.Medication 
                SET UserId = @UserId,
                    Medication = @Medication,
                    Dosage = @Dosage,
                    Quantity = @Quantity
                WHERE MedicationId = @MedicationId
        END
END

GO


CREATE OR ALTER PROCEDURE TutorialAppSchema.spPatient_Delete
    @UserId INT
AS
BEGIN
    DECLARE @Email NVARCHAR(50);

    SELECT  @Email = Patients.Email
      FROM  TutorialAppSchema.Patients
     WHERE  Patients.UserId = @UserId;

    DELETE  FROM TutorialAppSchema.Medication
     WHERE  Medication.UserId = @UserId;

    DELETE  FROM TutorialAppSchema.Patients
     WHERE  Patients.UserId = @UserId;

END;
GO

CREATE OR ALTER PROCEDURE TutorialAppSchema.spMedication_Delete
    @MedicationId INT
AS
BEGIN

    DELETE  FROM TutorialAppSchema.Medication
     WHERE  Medication.MedicationId = @MedicationId;

END;
GO

CREATE TABLE TutorialAppSchema.Auth(
    UserId INT IDENTITY(1, 1) UNIQUE,
	Email NVARCHAR(50) PRIMARY KEY,
	PasswordHash VARBINARY(MAX),
	PasswordSalt VARBINARY(MAX),
    RoleWorker NVARCHAR(10),
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    Gender NVARCHAR(10)
)

GO

CREATE OR ALTER PROCEDURE TutorialAppSchema.spLoginConfirmation_Get
    @Email NVARCHAR(50)
AS
BEGIN
    SELECT [Auth].[PasswordHash],
        [Auth].[PasswordSalt] 
    FROM TutorialAppSchema.Auth AS Auth 
        WHERE Auth.Email = @Email
END;
GO

CREATE OR ALTER PROCEDURE TutorialAppSchema.spRegistration_Upsert
    @Email NVARCHAR(50),
    @PasswordHash VARBINARY(MAX),
    @PasswordSalt VARBINARY(MAX),
    @RoleWorker NVARCHAR(10),
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @Gender NVARCHAR(10)
AS 
BEGIN
    IF NOT EXISTS (SELECT * FROM TutorialAppSchema.Auth WHERE Email = @Email)
        BEGIN
            INSERT INTO TutorialAppSchema.Auth(
                [Email],
                [PasswordHash],
                [PasswordSalt],
                RoleWorker ,
                FirstName ,
                LastName,
                Gender
            ) VALUES (
                @Email,
                @PasswordHash,
                @PasswordSalt,
                @RoleWorker,
                @FirstName,
                @LastName,
                @Gender
            )
        END
    ELSE
        BEGIN
            UPDATE TutorialAppSchema.Auth 
                SET PasswordHash = @PasswordHash,
                    PasswordSalt = @PasswordSalt
                WHERE Email = @Email
        END
END
GO

CREATE OR ALTER PROCEDURE TutorialAppSchema.spMedication_GetByUserId
/*EXEC TutorialAppSchema.spMedication_GetByUserId @UserId=1*/
    @UserId INT = NULL
AS
BEGIN

    SELECT *
    FROM TutorialAppSchema.Medication AS Medication 
        WHERE Medication.UserId = ISNULL(@UserId, Medication.UserId)
END
GO

CREATE OR ALTER PROCEDURE TutorialAppSchema.spMedication_GetByMedicationId
/*EXEC TutorialAppSchema.spMedication_GetByMedicationId @MedicationId=5*/
    @MedicationId INT = NULL
AS
BEGIN

    SELECT *
    FROM TutorialAppSchema.Medication AS Medication 
        WHERE Medication.MedicationId = ISNULL(@MedicationId, Medication.MedicationId)
END
GO

CREATE TABLE TutorialAppSchema.MedicationRequest (
    RequestId INT PRIMARY KEY IDENTITY(1,1),
    PatientId INT,
    NurseId INT,
    MedicationId INT,
    Quantity INT,
    RequestedAt DATETIME DEFAULT GETDATE(),
    Status VARCHAR(50), -- 'Pending', 'Approved', etc.
);
GO


CREATE OR ALTER PROCEDURE TutorialAppSchema.spMedicationRequest_Upsert
    @RequestId INT = NULL,
    @PatientId INT,
    @NurseId INT,
    @MedicationId INT,
    @Quantity INT,
    @Status VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM TutorialAppSchema.MedicationRequest
        WHERE RequestId = @RequestId
    )
    BEGIN
        INSERT INTO TutorialAppSchema.MedicationRequest (
            PatientId,
            NurseId,
            MedicationId,
            Quantity,
            RequestedAt,
            Status
        )
        VALUES (
            @PatientId,
            @NurseId,
            @MedicationId,
            @Quantity,
            GETDATE(),
            @Status
        )
    END
    ELSE
    BEGIN
        UPDATE TutorialAppSchema.MedicationRequest
        SET
            PatientId = @PatientId,
            NurseId = @NurseId,
            MedicationId = @MedicationId,
            Quantity = @Quantity,
            Status = @Status
        WHERE RequestId = @RequestId
    END
END

GO

CREATE OR ALTER PROCEDURE TutorialAppSchema.spMedicationRequest_Delete
    @RequestId INT
AS
BEGIN

    DELETE  FROM TutorialAppSchema.MedicationRequest
     WHERE  MedicationRequest.RequestId = @RequestId;
END;
GO

