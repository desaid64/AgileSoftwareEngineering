
drop schema HotelManagement; 
create schema if not exists HotelManagement;

use HotelManagement;

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
	constraint FK_DepartmentID foreign key (DepartmentID)
		references Departments(DepartmentID),
	constraint FK_Division_Code foreign key (DivisionCode)
		references DivisionCode(DivisionCode)
);

create table IF NOT EXISTS ContactMethods(
	MethodID int primary key,
    Method varchar(17),
	Modified datetime,
    Created datetime,
    CreatedBy int,
    ModifiedBy int
);

create table  IF NOT EXISTS Languages(
	LanguageCode int primary key,
    Language_ varchar(20), ## language is a keyword
	Modified datetime,
    Created datetime,
    CreatedBy int,
    ModifiedBy int
); 

create table IF NOT EXISTS Employees(
	EmployeeID int primary key,
    Username varchar(15) not null,
    Passwd char(64) /*assuming SHA-256*/,
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
    constraint FK_Method foreign key (CurrentContactMethod)
		references ContactMethods(MethodID),
	constraint FK_Language foreign key (PreferredLanguageID)
		references Languages(LanguageCode)
);

create table IF NOT EXISTS Shifts(
	ShiftID int,
    EmployeeID int,
    PrimaryLocation int,
    PrimaryJob int,
    SeniorityDateForShift datetime,
    ScheduledHours float,
    primary key(ShiftID, EmployeeID),
    constraint FK_EmployeeID_ foreign key (EmployeeID)
		references Employees(EmployeeID)
);

create table IF NOT EXISTS PositionList(
	Position_ varchar(20),
    JobCode int primary key,
    Modified datetime,
    Created datetime,
    CreatedBy int,
    ModifiedBy int
);

create table  IF NOT EXISTS EmployeeJobCodes(
	JobCodeID int,
    JobCode int,
	Modified datetime,
    Created datetime,
    CreatedBy int,
    ModifiedBy int,
    primary key(JobCodeID, JobCode),
	constraint FK_JobCodeNames foreign key (JobCode)
		references PositionList(JobCode)
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
    constraint FK_Main_EmployeeID foreign key (EmployeeID)
		references Employees(EmployeeID),
	constraint FK_Department foreign key (HomeDepartment)
		references Departments(DepartmentID),
	constraint FK_JobCodeID foreign key (JobCodeID)
		references EmployeeJobCodes(JobCodeID)
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
    constraint FK_DepartmentCodeID foreign key (DepartmentCodeID)
		references AvailableStaff(DepartmentCodeID),
	constraint FK_Depts foreign key (DepartmentCode)
		references Departments(DepartmentID)
);

create table IF NOT EXISTS DepartmentMapping(
	MasterDepartment int,
    ChildDepartment int,
    Modified datetime,
    Created datetime,
    CreatedBy int,
    ModifiedBy int,
    primary key(MasterDepartment, ChildDepartment),
    constraint FK_MasterDepartment foreign key (MasterDepartment)
		references EmployeeJobCodes(JobCode)
);

create table IF NOT EXISTS Users(
	id int(10) unsigned NOT NULL AUTO_INCREMENT primary key,
	username varchar(50) not null unique,
    email varchar(50) not null unique,
    `password` varchar(255) not null
);