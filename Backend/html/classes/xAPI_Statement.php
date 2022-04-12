<?php

class xAPI_Statement {
    /**
     * Constructeur de la classe xAPI_Statement
     * @param object $actor
     * @param object $verb
     * @param object $object
     */
    public function __construct(object $actor, object $verb, object $object) {
        $this->actor = json_encode($actor);
        $this->verb = json_encode($verb);
        $this->object = json_encode($object);
        $this->date = date("Y-m-d H:i:s");
    }
}

?>