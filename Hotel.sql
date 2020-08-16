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
  ResolveNoMgrAdvertise int,
  CopyDeptMgrOnEmails int,
  SystemEmailAddress varchar(25),
  SystemTimeZone varchar(25),
  NotifyMgrOfShiftResults int,
  ShiftManagerComunicationMethod int,
  NotifyMgrBeforeAdvertising int,
  MinutesToWaitForMgrToAdvertise int,
  MinutesToWaitForMgrFinalDecision int,
  ResolveNoMgrFinalDecision int,
  constraint FK_DepartmentIDForRules foreign key (DepartmentID) references Departments(DepartmentID)
);


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

DELIMITER $$
CREATE PROCEDURE  getDepartmentRules(
    IN depID int(11)
)
BEGIN
	select  
    AvailableShiftResponseDeadline, TimePeriodAllowedForCallOuts, ConfirmCalloutTimePeriod,
    ResolveNoMgrAdvertise , CopyDeptMgrOnEmails , NotifyMgrOfShiftResults , ShiftManagerComunicationMethod ,
	NotifyMgrBeforeAdvertising , MinutesToWaitForMgrToAdvertise , MinutesToWaitForMgrFinalDecision ,
	ResolveNoMgrFinalDecision
    from ShiftManagerRules where departmentID = depID;
END $$
DELIMITER


DELIMITER $$
CREATE PROCEDURE  getSystemSettings(
	IN depID int(11)
)
BEGIN
	select SystemEmailAddress, SystemTimeZone  from ShiftManagerRules where departmentID = depID ;
END $$

INSERT INTO Languages (`LanguageCode`, `Language_`) VALUES ('1', 'English');
INSERT INTO Languages (`LanguageCode`, `Language_`) VALUES ('2', 'Spanish');
INSERT INTO Languages (`LanguageCode`, `Language_`) VALUES ('3', 'Chinese');

Insert into departments (`DepartmentID`, `DepartmentName`) values (999999,'Shift Manager');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10000,'General Manager');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10001,'Front Desk');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10002,'Housekeeping');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10003,'Caferteria');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10004,'Kitchen Cook');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10005,'Room Service');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10006,'Information Techonolgy');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10007,'Human Resources');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10008,'Security');
Insert into departments (`DepartmentID`, `DepartmentName`) values (10009,'New Employee');

Call InsertAndReturnUser('smanager','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','smanager@gmail.com','0000000000',1,'Shift','Manager',999999);
Call InsertAndReturnUser('gmanager','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','gmanager@gmail.com','0000000001',1,'General','Manager',10000);
Call InsertAndReturnUser('fdesk','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','fdesk@gmail.com','0000000002',1,'Front','Desk',10001);
Call InsertAndReturnUser('hkeeping','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','hkeeping@gmail.com','0000000003',1,'House','Keeping',10002);
Call InsertAndReturnUser('cafeteria','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','cafeteria@gmail.com','0000000004',1,'Cafe','House',10003);
Call InsertAndReturnUser('kcook','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','kcook@gmail.com','0000000005',1,'Kitchen','Cook',10004);
Call InsertAndReturnUser('rservice','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','rservice@gmail.com','0000000006',1,'Room','Service',10005);
Call InsertAndReturnUser('infotech','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','infotech@gmail.com','0000000007',1,'Info','Tech',10006);
Call InsertAndReturnUser('hresources','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','hresources@gmail.com','0000000008',1,'Human','Resources',10007);
Call InsertAndReturnUser('security','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','security@gmail.com','0000000009',1,'Security','Deptarment',10008);
Call InsertAndReturnUser('nemployee','$2b$10$B8rAyL.yaq14Lpgbl1BEbe//G0auVWu7mK9H6Qts/gvGrvtTgQCJK','nemployee@gmail.com','0000000010',1,'New','Employeee',10009);

Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10000,60,2,30,'1','1','1','1','1',60,60,'1','generalmanager@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10001,60,2,30,'1','1','1','1','1',60,60,'1','frontdesk@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10002,60,2,30,'1','1','1','1','1',60,60,'1','housekeeping@system.com','(GMT-05:00) Eastern Time');
    Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10003,60,2,30,'1','1','1','1','1',60,60,'1','cafeteria@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10004,60,2,30,'1','1','1','1','1',60,60,'1','kitchencook@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10005,60,2,30,'1','1','1','1','1',60,60,'1','roomservice@system.com','(GMT-05:00) Eastern Time');
    Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10006,60,2,30,'1','1','1','1','1',60,60,'1','it@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10007,60,2,30,'1','1','1','1','1',60,60,'1','hr@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10008,60,2,30,'1','1','1','1','1',60,60,'1','security@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 10009,60,2,30,'0','0','0','0','0',60,60,'0','new@system.com','(GMT-05:00) Eastern Time');
Insert into shiftmanagerrules (`DepartmentID`,`AvailableShiftResponseDeadline`, `TimePeriodAllowedForCallOuts`, `ConfirmCalloutTimePeriod`,
    `ResolveNoMgrAdvertise` , `CopyDeptMgrOnEmails` , `NotifyMgrOfShiftResults` , `ShiftManagerComunicationMethod` ,
	`NotifyMgrBeforeAdvertising` , `MinutesToWaitForMgrToAdvertise` , `MinutesToWaitForMgrFinalDecision` ,
	`ResolveNoMgrFinalDecision`,`SystemEmailAddress`, `SystemTimeZone`) values ( 999999,60,2,30,'1','1','1','1','1',60,60,'1','shiftmanager@system.com','(GMT-05:00) Eastern Time');