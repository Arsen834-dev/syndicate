self.addEventListener('install', function(e) { self.skipWaiting(); });

self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function(e) {
    e.respondWith(fetch(e.request).catch(function() {
        return new Response('Offline', { status: 503 });
    }));
});

// Push-уведомления
self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'ТЕРМИНАЛ СИНДИКАТА', body: event.data.text() };
        }
    }
    
    const options = {
        body: data.body || '',
        icon: data.icon || 'https://wiki.adven.space/items/contraband/pais.png',
        badge: 'https://wiki.adven.space/items/contraband/pais.png',
        tag: 'syndicate',
        vibrate: [200, 100, 200],
        data: data.url || '/'
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'ТЕРМИНАЛ СИНДИКАТА', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function(clientList) {
            for (let client of clientList) {
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data || '/');
            }
        })
    );
});
