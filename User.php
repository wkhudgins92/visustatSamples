<?php
// VisuStat
// Version 1.0
// User.php
//
// Contains the User.php core data class

require_once '../databaseInterface.php';
require_once 'DueDate.php';
require_once 'CoursePointer.php';
require_once 'Address.php';


/**
 * This class operates as the core data class for the User class
*/
class User implements JsonSerializable 
{
	private $type;
	private $fname;
	private $lname;
	private $username;
	private $email;
	private $address;
	private $phone;
	private $expiration;
	private $passwordHash;
	private $course;
	private $dueDates;
	private $assignments;
		
	/**
	 * Constructor for the User object
	 *
	 * @param int $type user's type: 0 UNVER, 1 ST, 2 FAC, 3 VERI FAC
	 * @param String $fname user's first name
	 * @param String $lname user's lastname
	 * @param String $username user's username
	 * @param String $email user's email
	 * @param Address $address user's address
	 * @param int $phone user's phone number
	 * @param int $expiration date the user's account is no longer active
	 * @param String $passwordHash hash of user's password
	 * @param CoursePointer[] $course array of all courses a user is linked to
	 * @param DueDate[] $dueDates array of due date for all user's assignments
	 * @param int[] $assignments array of all user's assignments
	 */
	public function __construct($type, $fname, $lname, $username, 
		$email, $address, $phone, $expiration, $passwordHash, $course,
		$assignmentDates, $assignments)
	{
		$this->type = $type;
		$this->fname = $fname;
		$this->lname = $lname;
		$this->username = $username;
		$this->email = $email;
		$this->address = $address;
		$this->phone = $phone;
		$this->expiration = $expiration;
		$this->passwordHash = $passwordHash;
		$this->course = $course;
		$this->dueDates = $assignmentDates;
		$this->assignments = $assignments;
	}

	/**
	 * Constructor that takes the User class' JSON representation
	 *
	 * $param String $jsonObject object's JSON representation. 
	*/	
	public static function __constructJson($jsonObject)
	{
		$address = castResults($jsonObject['address'], "Address");
		$course = castResults($jsonObject['course'], "CoursePointer");
		$dueDate = castResults($jsonObject['dueDates'], "DueDate");
		$new = new User($jsonObject['type'], $jsonObject['fname'], 
				$jsonObject['lname'], $jsonObject['username'], 
				$jsonObject['email'], $address, $jsonObject['phone'], 
				$jsonObject['expiration'], $jsonObject['passwordHash'], $course,
				$dueDate, $jsonObject['assignments']);
		return $new;
	}
	
	/**
	 *
	 * Copy constructor for User class
	 *
	 * @param User $other existing User object to copy
	 */
	public static function __constructCopy($other)
	{	
		$new = new User($other->type, $other->fname, $other->lname, 
			$other->username, $other->email, $other->address, $other->phone, 
			$other->expiration, $other->passwordHash, $other->course, 
			$other->assignmentDates);
		return $new;
	}

	/**
	 * Returns the user's type
	 *  
	 * @return int user's type
	 */
	public function getType()
	{
		return $this->type;
	}

	/**
	 * Returns the user's name in "first last" format
	 *  
	 * @return String user's name in "first last" format
	 */
	public function getName()
	{
		return $this->fname." ".$this->lname;
	}	
	
	/**
	 * Returns the user's username 
	 *  
	 * @return String user's username
	 */
	public function getUsername()
	{
		return $this->username;
	}
	
	/**
	 * Returns the user's email address
	 *  
	 * @return String user's email
	 */
	public function getEmail()
	{
		return $this->email;
	}

	/**
	 * Returns the user's license expiration date
	 *  
	 * @return int user's expiration date
	 */
	public function getExpiration()
	{
		return $this->expiration;
	}

	/**
	 * Returns hashed version of user's password
	 *  
	 * @return String hashed version of user's password
	 */
	public function getPasswordHash()
	{
		return $this->passwordHash;
	}

	/**
	 * Returns array of pointers for all the user's courses
	 *  
	 * @return CoursePointer[] pointer to all courses a user's affliated with
	 */
	public function getCourses()
	{
		return $this->course;
	}

	/**
	 * Returns due date for all assignments linked to user
	 *  
	 * @return DueDate[] array of due date for all assignments linked to user
	 */
	public function getAllDueDates()
	{
		return $this->dueDates;
	}

	/**
	 * Returns the due date for a specific assignment
	 * 
	 * @param int $assignmentId ID of the desired assignment 
	 * @return int the due date for the specified assignment
	 */
	public function getDueDate($assignmentId)
	{
		$found = false;
		$arrCount = count($this->dueDates);
		
		for ($i = 0; $i < $arrCount && !$found; $i++)
		{
			if ($this->dueDates[$i].getAssignmentId == $assignmentId)
			{
				$date = $this->ueDates[$i].getDueDate();	
				$found = true;
			}
		}

		return $date;
	}

	/**
	 * Returns ID of all assignments linked to a user
	 *  
	 * @return int[] returns array of IDs for all assignments linked to a user
	 */
	public function getAllAssignments()
	{
		return $this->assignments; // Should it work this way?? Or Assignment[]
	}

	/**
	 * Returns whether a user is in a specified class
	 * 
	 * @param CoursePointer $otherCourse pointer for course in question
	 * @return boolean whether the user is in the specified course
	 */
	public function inClass($otherCourse)
	{
		$inClass = false;
		$arrCount = count($this->course);

		for ($i = 0; $i < $arrCount && !$inClass; $i++)
		{
			if ($this->course[$i]->equals($courseId))
				$inClass = true;
		} 

		return $inClass;
	}

	/**
	 * Returns whether the user is faculty
	 *  
	 * @return boolean whether user is faculty
	 */
	public function isFaculty()
	{
		return ($type == 2) || ($type == 3);
	}

	/**
	 * Sets the user's type
	 *  
	 * @param int $type user's new type
	 */
	public function setType($type)
	{
		$this->type = $type;
	}	
	
	/**
	 * Sets the user's first and last name
	 *  
	 * @param String $fname user's new first name
	 * @param String $lname user's new last name
	 */
	public function setName($fname, $lname)
	{
		$this->fname = $fname;
		$this->lname = $lname;
	}

	/**
	 * Sets the user's email address
	 *  
	 * @param String $newEmail user's new email address
	 */
	public function setEmail($newEmail)
	{
		$this->email = $newEmail;
	}

	/**
	 * Sets the user's address
	 *  
	 * @param Address $newAddress user's new address
	 */
	public function setAddress($newAddress)
	{
		$this->address = $newAddress;
	}

	/**
	 * Sets the user's date of account expiration
	 *  
	 * @param int $newExpiration user's new expiration date
	 */
	public function setExpiration($newExpiration)
	{
		$this->expiration = $newExpiration;
	}
	
	/**
	 * Sets the user's password hash
	 *  
	 * @param String $newPasswordHash user's new password hash
	 */
	public function setPasswordHash($newPasswordHash)
	{
		$this->passwordHash = $newPasswordHash;
	}

	/**
	 * Sets the user's course list
	 *  
	 * @param CoursePointer[] $newCourse array of course IDs
	 */
	public function setCourses($newCourse)
	{
		$this->course = $newCourse;
	}

	/**
	 * Sets the due date for an assignment
	 *  
	 * @param int $assignmentId the ID of the assignment
	 * @param int $newDate the new due date
	 * @return boolean if the update was successful. Will return false if there
     *		is no existing due date matching $assignmentId
	 */
	public function setDueDate($assignmentId, $newDate)
	{
		$break = false;
		$arrCount = count($this->dueDates);
	
		for ($i = 0; $i < $arrCount && !$break; $i++)
		{
			if ($this->dueDates[$i].getAssignmentId == $assignmentId)
			{
				$this->dueDates[$i].setDueDate($newDate);
				$break = true;
			}
		}

		return $break;	
	}
	
	/**
	 * Adds a course to the user's course list
	 *  
	 * @param CoursePonter $newCourse course to add
	 */
	public function addCourse($newCourseId)
	{
		array_push($this->course, $newCourseId);
	}

	/**
	 * Removes a course from the user's course list
	 *  
	 * @param CoursePointer $targetCourse course to be removed
	 * @return boolean whether the removal operation was successful. Will return
	 *		false if the user was not associated with $courseId
	 */
	public function removeCourse($targetCourse)
	{
		$success = false;
		$size = count($this->course);

		for ($i = 0; $i < $size && !$success; $i++)
		{
			if ($this->course[$i].equals($targetCourse))
			{
				unset($this->course[$i]);
				$this->course = array_values($this->course); // Reorders array
				$success = true;
			}
		}

		return $success;
	}

	/**
	 * Associates a new assignment with the user
	 *  
	 * @param int $newAssignment the new assignment's ID
	 */
	public function addAssignment($newAssignment)
	{
		array_push($this->assignments, $newAssignment);	
	}

	/**
	 * Dissociates an assignment with the user
	 *  
	 * @param int $assignmentId the assignment to dissociate
	 */
	public function removeAssignment($assignmentId)
	{
		$success = false;
		$index = array_search($assignmentIdId, $this->assignments);

		// !== incase $index == 0
		if ($index !== false)
		{
			unset($this->assignments[$index]);
			$this->assignments = array_values($this->assignments); // Reorders
			$success = true;
		}

		return $success;
	}

	/**
	 * Returns array of all active assignments' IDs
	 *
	 * @return array of active assignment IDs
	 */
	public function getActiveAssignments()
	{
// Get all assignments in assignments[] from DBI 
// Loop thoruh adding active ones to array
// Return array
	}
// Need get activeAssignmentsByCourse
// NEed getAssignmentsByCourse

	/**
	 * Encodes the object in JSON format. Called whenever json_encode() is used
	 *
	 * @return Some shit here. Donkey Dog.
	 */
	public function jsonSerialize()
	{
		return ['class' => "User",
				'type' => $this->type,
				'fname' => $this->fname,
				'lname' => $this->lname,
				'username' => $this->username,
				'email' => $this->email,
				'address' => $this->address,
				'phone' => $this->phone,
				'expiration' => $this->expiration,
				'passwordHash' => $this->passwordHash,
				'course' => $this->course,
				'dueDates' => $this->dueDates,
				'assignments' => $this->assignments
				];
	}

	/**
	 * Sets the user's phone number
	 * 
	 * @param int user's new phone number
	 */
	public function setPhone($newPhone)
	{
		$this->phone = $newPhone;
	}

	/** 
	 * Removes a due date associated with the user
	 *
	 * @param int $assignmentId ID of the assignment due date to be removed
	 */
	private function removeDueDate($assignmentId)
	{	
		$break = false;
		$arrCount = count($this->dueDates);
	
		for ($i = 0; $i < $arrCount && !$break; $i++)
		{
			if ($this->dueDates[$i].getAssignmentId == $assignmentId)
			{
				unset($this->dueDates[$i]);
				$break = true;
			}
		}
		
		$this->dueDates = array_values($this->dueDates);
	}

	/** 
	 * Associates a new due date with the user
	 *
	 * @param int $assignmentId ID of the assignment the due date is for
	 * @param int $date the due date
	 */
	private function addDueDate($assignmentId, $date)
	{
		array_push($this->dueDates, new DueDate($assignmentId, $date));
	}
}
