import { GithubUser } from "./GithubUser.js"

export class Favorities {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem
        ('@github-favorities:')) || []
    }

    save(){
        localStorage.setItem('@github-favorities',JSON.stringify(this.entries))
    }

    async add(username){
        try{
            const userExists = this.entries.find(entry => entry.login == username.login)
            console.log(userExists)

            if(userExists){
                throw new Error("Esse usuário já existe na lista")
            }

            const user = await GithubUser.search(username)
            console.log(user)
            if(user.login === undefined){
                throw new Error('Usuário não encontrado')
            }
            this.entries = [user,...this.entries]
            this.update()
            this.save()
        }catch(error){
            alert(error.message)

        }
    }

    delete(user) {
        console.log(this.entries)
        const filtered = this.entries.filter(entry => {entry.login !== user.login})
        this.entries = filtered
        this.update()
        this.save()
    }


}

export class FavoritiesView extends Favorities {
    constructor(root) {
        super(root)
        this.update();
        this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () =>{
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update() {
        this.RemoveAllTr()

        this.createRow()
        let user = this.entries
        let row = document.querySelectorAll('.remove')
        row.forEach(row => {
            row.addEventListener('click', () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOk) {
                    this.delete(user)
                }
            })
        })
    }

    createRow() {
        const tr = document.createElement('tr')
        const user = this.entries
        for (let i = 0; i < this.entries.length; i++) {

            document.querySelector('tbody').innerHTML += `
            <tr>
              <td class="user">
                  <img src="https://github.com/${user[i].name}.png" alt="">
                  <a href="https://github.com/${user[i].login}" target="_blank">
                    <p><strong>${user[i].name}</strong></p>
                          <span>${user[i].login}</span>
                      </a>
              </td>
              <td class="repositories">
                ${user[i].public_repos}
              </td>
             <td class="followers">
                 ${user[i].followers}
             </td>
             <td>
              <button class = "remove">&times;</button>
               </td>
             </tr>`
        }

    }

    RemoveAllTr() {
        const tbody = this.root.querySelector('tbody')
        tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })

    }

}

