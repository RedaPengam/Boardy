<?php

class Column {
    /**
     * Constructeur de la classe Column
     * @param int $id id de la Column
     * @param int $id_PB id_PB de la Column
     * @param int $id_USB id_USB de la Column
     * @param int $id_user id_user de la Column
     * @param string $title titre de la Column
     * @param string $color couleur de la Column
     * @param int $columnTimescale échelle de temps de la Column
     * @param int $isInitial caractère initial de la Column
     * @param int $isTerminal caractère terminal de la Column
     * @param string $kind type de la Column
     * @param array $stickers stickers de la Column
     */
    public function __construct(int $id, int $id_PB, int $id_USB, int $id_user, string $title, string $color, int $columnTimescale, int $isInitial, int $isTerminal, string $kind, array $stickers) {
        $this->id = $id;
        $this->id_PB = $id_PB;
        $this->id_USB = $id_USB;
        $this->id_user = $id_user;
        $this->title = $title;
        $this->color = $color;
        $this->columnTimescale = $columnTimescale;
        $this->isInitial = $isInitial;
        $this->isTerminal = $isTerminal;
        $this->kind = $kind;
        $this->stickers = $stickers;
    }
}

?>