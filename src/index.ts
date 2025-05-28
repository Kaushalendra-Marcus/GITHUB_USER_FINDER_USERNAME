const getUsername = document.querySelector('#user') as HTMLInputElement;
const formSubmit = document.querySelector('#form') as HTMLFormElement;
const main_container = document.querySelector('.main-container') as HTMLElement;
interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    url: string;
    followers: number;
    following: number;
}

//  Fetching data with headers
async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        // headers: {
        //     Authorization: `token ${token}`
        // }
    });

    if (!response.ok) {
        throw new Error(`Network Error status ${response.status}`);
    }

    const data = await response.json();
    return data;
}

// UI render
const uiDisplay = (user: UserData) => {
    const { avatar_url, login, url, followers, following } = user;
3
1
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
            <img src="${avatar_url}" alt="${login}" />
            <hr />
            <div class='card-footer'>
                <img src="${avatar_url}" alt="${login}" />
                <div>
                    <h3>${login}</h3>
                    <a href="${url}" target="_blank">View Profile</a>
                </div>
            </div>
            <div class='follow'>
                <h3>Followers: ${followers}</h3>
                <h3>Following: ${following}</h3>
            </div>
        </div>`
    );
};

// ✅ Handle form submission
formSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.trim().toLowerCase();
    main_container.innerHTML = '<div class="loading">Loading...</div>';

    try {
        if (searchTerm) {
            // Use GitHub search API
            const result = await fetchData<{ items: UserData[] }>(
                `https://api.github.com/search/users?q=${searchTerm}`
            );

            main_container.innerHTML = '';

            if (result.items.length === 0) {
                main_container.innerHTML = `<p>No users found</p>`;
                return;
            }

            for (const user of result.items) {
                // Fetch full user data
                const detailedUser = await fetchData<UserData>(user.url);
                uiDisplay(detailedUser);
            }

        } else {
            // Show all users (only a few users returned)
            const users = await fetchData<UserData[]>("https://api.github.com/users");
            main_container.innerHTML = '';
            for (const user of users) {
                const detailedUser = await fetchData<UserData>(user.url);
                uiDisplay(detailedUser);
            }
        }
    } catch (error: any) {
        main_container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
});
