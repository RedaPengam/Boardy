<?php

class Sticker {
    /**
     * Constructeur de la classe Sticker
     * @param int $id id du Sticker
     * @param int $id_PB id_PB du Sticker
     * @param int $id_USB id_USB du Sticker
     * @param int $id_currentColumn id_currentColumn du Sticker
     * @param int $id_user id_user du Sticker
     * @param string $title titre du Sticker
     * @param string $detail description du Sticker
     * @param string $kind type du Sticker
     */
    public function __construct(int $id, int $id_PB, int $id_USB, int $id_currentColumn, int $id_user, string $title, string $detail, string $kind) {
        $this->id = $id;
        $this->id_PB = $id_PB;
        $this->id_USB = $id_USB;
        $this->id_currentColumn = $id_currentColumn;
        $this->id_user = $id_user;
        $this->title = $title;
        $this->detail = $detail;
        $this->kind = $kind;
    }
}

?>