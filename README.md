# Boardy

Dans le cadre de mon stage de L3 à l'IMT Nord Europe, j'ai développé une application Web de taskboarding utile pour la gestion de projets utilisant les méthodes agiles.

![Capture d'écran 2023-03-31 141122](https://user-images.githubusercontent.com/71394086/229117035-e4d34147-d566-4132-8eec-8942eb960eff.png)
![Capture d'écran 2023-03-31 141140](https://user-images.githubusercontent.com/71394086/229117022-ffdc2959-3853-4501-a0cd-51d5a700e53d.png)
![Capture d'écran 2023-03-31 141153](https://user-images.githubusercontent.com/71394086/229116984-298cff02-dc7a-437a-ae61-8af5ed99b56e.png)
![Capture d'écran 2023-03-31 141204](https://user-images.githubusercontent.com/71394086/229116884-84dff951-18f2-48d6-989f-5b04654f6246.png)

## Dépendances

Pour pouvoir lancer l'application il faut une ou deux machines (client et serveur).
- Dans la machine client doit être installé le gestionnaire de packages `npm`. Pour de plus amples détails, les dépendances de la machine client sont listées dans le fichier `Boardy/Frontend/react-taskboard/package.json`
- Dans la machine serveur (Debian APACHE) doit être installé le package `LAMP`, ainsi que la base de données `boardy.sql`.

## Organisation du projet

L'application se décompose en deux répertoires : un répertoire *frontend* et un répertoire *backend*.

- Arborescence du *frontend*

 ![image](https://user-images.githubusercontent.com/71394086/131319346-57525d6e-babb-40af-8ced-433bc7f4029c.png)
 ![image](https://user-images.githubusercontent.com/71394086/131320029-75dcc3ca-3373-4ec8-885a-f55a7fe9e24b.png)

- Arborescence du *backend*

![image](https://user-images.githubusercontent.com/71394086/131320162-43f29dfc-7b0e-4667-bc86-27eec759b969.png)

## Installation

Afin d'obtenir la même arborescence que présentée précédemment pour la partie frontend, il faut dans un premier temps se situer dans un répertoire arbitraire sur la machine frontend. 
A titre d'exemple, dans les screenshots précédents le répertoire initial est `apaches.stage-reda-taskboard`.
Depuis l'invite de commande lancé dans le répertoire choisi, il faut créer l'application React en utilisant la commande `npx create-react-app react-taskboard`.
Cette action va créer l'application React de base avec le dossier `node_modules` non présent dans ce repo git du fait de son poids conséquent.

## Lancement de l'application

Pour se faire, il faut se placer dans le répertoire `react-taskboard` et effectuer la commande `npm run start`.

![image](https://user-images.githubusercontent.com/71394086/131320934-c8b1ddd6-bde4-4d24-b594-1fa97088e528.png)

L'appli se lance alors dans le navigateur choisi sur l'adresse locale :

![image](https://user-images.githubusercontent.com/71394086/131321976-f102be4c-7c67-41b6-9a21-8f0bfba525ce.png)


