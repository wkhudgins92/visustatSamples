<?php
// VisuStat
// Version 1.0
// Course.php
//
// Contains the Course.php core data class

/**
 * This class operates as the core data class for the Class class
*/
class Course implements JsonSerializable 
{
	private $institution;
	private $name;
	private $description;
	private $term;
	private $discipline;
	
	/**
	 * Constructor for the Course object
	 *
	 * @param String $institution institution class is offered at
	 * @param String $name class' name
	 * @param String $description class' description
	 * @param int $term term for this instance of the class
	 * @param String $discipline discipline this class is associated with
	 */
	public function __construct($institution, $name, $description, $term, 
		$discipline)
	{
		$this->institution = $institution;
		$this->name = $name;
		$this->description = $description;
		$this->term = $term;
		$this->discipline = $discipline;
	}

	/**
	 * Constructor that takes the Class class' JSON representation
	 *
	 * $param String $jsonObject object's JSON representation. 
	*/	
	public static function __constructJson($jsonObject)
	{
		$new = new Course($jsonObject['institution'], $jsonObject['name'],
			$jsonObject['description'], $jsonObject['term'], 
			$jsonObject['discipline']);
		return $new;
	}
	
	/**
	 *
	 * Copy constructor for Class class
	 *
	 * @param Class $other existing Class object to copy
	 */
	public static function __constructCopy($other)
	{
		$new = new Course($other->institution, $other->name,
			$other->description, $other->term, $other->discipline);	
		return $new;
	}

	/**
	 * Returns the class' institution
	 *  
	 * @return String class' institution
	 */
	public function getInstitution()
	{
		return $this->institution;
	}	
	
	/**
	 * Returns the class' name 
	 *  
	 * @return String class' name
	 */
	public function getName()
	{
		return $this->name;
	}
	
	/**
	 * Returns the class' description
	 *  
	 * @return String class' description
	 */
	public function getDescription()
	{
		return $this->description;
	}

	/**
	 * Returns the term this instance of the class is offered
	 *  
	 * @return int current term
	 */
	public function getTerm()
	{
		return $this->term;
	}

	/**
	 * Returns discipline class is associated with
	 *  
	 * @return String class' discipline
	 */
	public function getDiscipline()
	{
		return $this->discipline;
	}
	
	/**
	 * Returns whether a specified user is in the class
	 * 
	 * @param int $userId the ID of the user in question
	 * @return boolean whether the specified user is in the class
	 */
	public function inClass($userId)
	{
		require_once '../databaseInterface.php';
		// Call DBI stuff
	}
	
	/**
	 * Sets class' institution
	 *  
	 * @param String $newInstitution class' new institution
	 */
	public function setInstitution($newInstitution)
	{
		$this->institution = $newInstitution;
	}

	/**
	 * Sets the class' name
	 *  
	 * @param String $newName class' new name
	 */
	public function setName($newName)
	{
		$this->name = $newName;
	}

	/**
	 * Sets the class' description
	 *  
	 * @param String $newDescription class' new description
	 */
	public function setDescription($newDescription)
	{
		$this->description = $newDescription;
	}

	/**
	 * Sets the class' current term
	 *  
	 * @param int $newTerm
	 */
	public function setTerm($newTerm)
	{
		$this->term = $newTerm;
	}
	
	/**
	 * Sets the class' discipline
	 *  
	 * @param String $newDiscipline class' new discipline
	 */
	public function setDiscipline($newDiscipline)
	{
		$this->discipline = $newDiscipline;
	}

	/**
	 * Return array of users associated with class
	 *  
	 * @return User[] array of users associated with class
	 */
	public function getStudnets()
	{
		require_once '../databaseInterface.php';
	}

	/**
	 * Return array of all assignments associated with class
	 *  
	 * @return Assignment[] array of assignments associated with class
	 */
	public function getAssignments()
	{
		// Calls to DBI here
		// Will check them faculty member's list of assignments cause they
		// done got a master list of all dem assignments for tha class
	}

	/**
	 * Encodes the object in JSON format. Called whenever json_encode() is used
	 *
	 * @return Some shit here. Donkey Dog.
	 */
	public function jsonSerialize()
	{
		return ['class' => "Course",
				'institution' => $this->institution,
				'name' => $this->name,
				'description' => $this->description,
				'term' => $this->term,
				'discipline' => $this->discipline
				];
	}
}
