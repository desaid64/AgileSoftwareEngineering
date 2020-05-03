drop schema HotelManagement_Team_2;
create schema if not exists HotelManagement_Team_2;
use HotelManagement_Team_2;
CREATE TABLE IF NOT EXISTS Departments(
  DepartmentID int primary key,
  DepartmentName varchar(50) not null,
  PrimaryMgrContact int,
  SecondaryMgrContact int,
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int
);
create table IF NOT EXISTS DivisionCode(
  DivisionCode int primary key,
  DivisionName varchar(20),
  DivisionAbbreviation varchar(5),
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int
);
create table IF NOT EXISTS DepartmentDivisions(
  DepartmentID int,
  DivisionCode int,
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int,
  primary key (DepartmentID, DivisionCode),
  constraint FK_DepartmentID foreign key (DepartmentID) references Departments(DepartmentID),
  constraint FK_Division_Code foreign key (DivisionCode) references DivisionCode(DivisionCode)
);
create table IF NOT EXISTS ContactMethods(
  MethodID int primary key,
  Method varchar(17),
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int
);
create table IF NOT EXISTS Languages(
  LanguageCode int primary key,
  Language_ varchar(20),
  ## language is a keyword
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int
);
create table IF NOT EXISTS Employees(
  EmployeeID int primary key AUTO_INCREMENT,
  Username varchar(15) not null,
  Passwd char(64)
  /*assuming SHA-256*/,
  CurrentContactMethod int,
  PreferredEmail varchar(25),
  PreferredText varchar(10),
  PhoneNumber varchar(10),
  PreferredLanguageID int,
  FirstName varchar(15),
  LastName varchar(15),
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int,
  DepartmentID int,
  isAdmin int,
  constraint FK_Method foreign key (CurrentContactMethod) references ContactMethods(MethodID),
  constraint FK_Language foreign key (PreferredLanguageID) references Languages(LanguageCode),
  constraint FK_Department_ID foreign key (DepartmentID) references Departments(DepartmentID)
);
create table IF NOT EXISTS Shifts(
  ShiftID int,
  EmployeeID int,
  PrimaryLocation int,
  PrimaryJob int,
  SeniorityDateForShift datetime,
  ScheduledHours float,
  primary key(ShiftID, EmployeeID),
  constraint FK_EmployeeID_ foreign key (EmployeeID) references Employees(EmployeeID)
);
create table IF NOT EXISTS PositionList(
  Position_ varchar(20),
  JobCode int primary key,
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int
);
create table IF NOT EXISTS EmployeeJobCodes(
  JobCodeID int,
  JobCode int,
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int,
  primary key(JobCodeID, JobCode),
  constraint FK_JobCodeNames foreign key (JobCode) references PositionList(JobCode)
);
create table IF NOT EXISTS AvailableStaff(
  EmployeeID int primary key,
  EmployeeStartDate datetime,
  HomeDepartment int,
  ExcludeFromAvailableShifts boolean,
  JobCodeID int,
  DepartmentCodeID int,
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int,
  constraint FK_Main_EmployeeID foreign key (EmployeeID) references Employees(EmployeeID),
  constraint FK_Department foreign key (HomeDepartment) references Departments(DepartmentID),
  constraint FK_JobCodeID foreign key (JobCodeID) references EmployeeJobCodes(JobCodeID)
);
create index Depts on AvailableStaff(DepartmentCodeID);
create index jobs on AvailableStaff(JobCodeID);
create table IF NOT EXISTS EmployeeDepartmentCodes(
  DepartmentCodeID int,
  DepartmentCode int,
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int,
  primary key(DepartmentCodeID, DepartmentCode),
  constraint FK_DepartmentCodeID foreign key (DepartmentCodeID) references AvailableStaff(DepartmentCodeID),
  constraint FK_Depts foreign key (DepartmentCode) references Departments(DepartmentID)
);
create table IF NOT EXISTS DepartmentMapping(
  MasterDepartment int,
  ChildDepartment int,
  Modified datetime,
  Created datetime,
  CreatedBy int,
  ModifiedBy int,
  primary key(MasterDepartment, ChildDepartment),
  constraint FK_MasterDepartment foreign key (MasterDepartment) references EmployeeJobCodes(JobCode)
);
create table IF NOT EXISTS ShiftManagerRules(
  DepartmentID int,
  AvailableShiftResponseDeadline int,
  TimePeriodAllowedForCallOuts int,
  ConfirmCalloutTimePeriod int,
  ResolveNoMgrAdvertise varchar(25),
  CopyDeptMgrOnEmails char(3),
  SystemEmailAddress varchar(25),
  SystemTimeZone varchar(25),
  NotifyMgrOfShiftResults char(3),
  ShiftManagerComunicationMethod varchar (25),
  NotifyMgrBeforeAdvertising char(3),
  MinutesToWaitForMgrToAdvertise int,
  MinutesToWaitForMgrFinalDecision int,
  ResolveNoMgrFinalDecision varchar (25),
  constraint FK_DepartmentIDForRules foreign key (DeparmtentID) references Departments(DeparmtentID)
);

use HotelManagement_Team_2;
INSERT INTO `HotelManagement_Team_2`.`Languages` (`LanguageCode`, `Language_`) VALUES ('1', 'English');
INSERT INTO `HotelManagement_Team_2`.`Languages` (`LanguageCode`, `Language_`) VALUES ('2', 'Spanish');
INSERT INTO `HotelManagement_Team_2`.`Languages` (`LanguageCode`, `Language_`) VALUES ('3', 'Chinese');



DELIMITER $$
CREATE PROCEDURE  checkUserExists(
	IN identifier varchar(25) 
)
BEGIN
	select * from Employees where Username = identifier or PreferredEmail = identifier;
END $$
DELIMITER 


DELIMITER $$
CREATE PROCEDURE  checkUserExistsAndReturnIdentifiers(
	IN identifier varchar(25) 
)
BEGIN
	select Username,PreferredEmail from Employees where Username = identifier or PreferredEmail = identifier;
END $$
DELIMITER 


DELIMITER $$
CREATE PROCEDURE  InsertAndReturnUser(
	IN username varchar(15),
    IN password_digest char(64),
    IN email varchar(25),
    IN phoneNumber varchar(10),
    IN languageID int(11),
    IN firstName varchar(15),
    IN lastName varchar(15),
    IN departmentID int(11)
)
BEGIN
	DECLARE isAdmin int(11) DEFAULT 0;
	IF departmentID = 999999 THEN
        SET isAdmin = 1;
	ELSE
		SET isAdmin = 0;
    END IF;
	INSERT INTO Employees (Username,Passwd,PreferredEmail,PhoneNumber,PreferredLanguageID,FirstName,LastName,DepartmentID,isAdmin) VALUES 
    (username,password_digest,email,phoneNumber,languageID,firstName,lastName,departmentID,isAdmin);
    SELECT EmployeeId,Username,PreferredEmail,DepartmentID,isAdmin from Employees where EmployeeID = (SELECT last_insert_id());
END $$
DELIMITER 