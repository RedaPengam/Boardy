<?php

class Verb {
    /**
     * Constructeur de la classe Verb
     * @param string $id_verb
     * @param string $detail
     */
    public function __construct(string $id_verb, string $detail) {
        $this->id_verb = $id_verb;
        $this->detail = $detail;
    }
}

?>