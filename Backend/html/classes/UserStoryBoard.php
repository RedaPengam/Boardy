<?php

class UserStoryBoard {
    /**
     * Constructeur de la classe UserStoryBoard
     * @param int $id id du UserStoryBoard
     * @param int $id_PB id_PB du UserStoryBoard
     * @param int $id_user id_user du UserStoryBoard
     * @param string $title title du UserStoryBoard
     * @param string $color color du UserStoryBoard
     * @param array $columns colonnes du UserStoryBoard
     */
    public function __construct(int $id, int $id_PB, int $id_user, string $title, string $color, array $columns) {
        $this->id = $id;
        $this->id_PB = $id_PB;
        $this->id_user = $id_user;
        $this->title = $title;
        $this->color = $color;
        $this->columns = $columns;
    }
}

?>