import { GithubUser } from "./GithubUser.js"

export class Favorities {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorities:')) || []
    }

    save(){
        localStorage.setItem('@github-favorities:',JSON.stringify(this.entries))
    }

    async add(username){
        try{
            const userExists = this.entries.find(entry => {return entry.login === username})

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

    async delete(id) {
        const user = await GithubUser.search(id)
        const filtered = this.entries.filter(entry => { return entry.login !== user.login});
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
                    let id = row.classList.value
                    id = String(id)
                    id = id.split(' ')
                    id = id[1]
                    this.delete(id)
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
                  <img src="https://github.com/${user[i].login}.png" alt="">
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
              <button class = "remove ${user[i].login}">&times;</button>
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

