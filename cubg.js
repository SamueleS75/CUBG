module.exports = {
  server_startup: function(parent) {
    console.log("[CUBG] Plugin caricato con successo");

    parent.AddAdminTab('Utenti Connessi', '/cubg');

    parent.app.get('/cubg', function(req, res) {
      const sessions = parent.webserver.userSessions;
      const usersByGroup = {};

      for (const sessionid in sessions) {
        const session = sessions[sessionid];
        const username = session.userid;
        const user = parent.users[username];
        const group = (user && user.site) ? user.site : 'Nessun gruppo';

        if (!usersByGroup[group]) usersByGroup[group] = new Set();
        usersByGroup[group].add(username);
      }

      let html = `<h2>Utenti connessi per gruppo</h2>`;
      if (Object.keys(usersByGroup).length === 0) {
        html += `<p>Nessun utente connesso.</p>`;
      } else {
        for (const group in usersByGroup) {
          html += `<h3>${group}</h3><ul>`;
          usersByGroup[group].forEach(user => {
            html += `<li>${user}</li>`;
          });
          html += `</ul>`;
        }
      }

      res.send(html);
    });
  }
};
