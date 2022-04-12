<?php

class PlanningBoard {
    /**
     * Constructeur de la classe PlanningBoard
     * @param int $id id du PlanningBoard
     * @param int $id_user id_user du PlanningBoard
     * @param string $title titre du PlanningBoard
     * @param string $color coleur du PlanningBoard
     * @param array $columns colonnes du PlanningBoard
     */
    public function __construct(int $id, int $id_user, string $title, string $color, array $columns) {
        $this->id = $id;
        $this->id_user = $id_user;
        $this->title = $title;
        $this->color = $color;
        $this->columns = $columns;
    }
}

?>