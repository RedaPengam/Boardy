<?php

class Actor {
    /**
     * Constructeur de la classe Actor
     * @param int $id id de l'utilisateur
     * @param string $firstname prénom de l'utilisateur
     * @param string $lastname nom de l'utilisateur
     * @param string $email mail de l'utilisateur
     * @param string $quality qualité de l'utilisateur
     */
    public function __construct(int $id, string $firstname, string $lastname, string $email, string $quality) {
        $this->id = $id;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->email = $email;
        $this->quality = $quality;
    }
}

?>