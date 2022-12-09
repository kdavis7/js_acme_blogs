function createElemWithText(para = "p", textContent = "", className) {
    const myElement = document.createElement(para);
    myElement.textContent = textContent;
    if (className) {
      myElement.classList.add(className);
    }
    if (!className) {
      console.log("className undefined or className is optional");
    }
  
    return myElement;
  }
  
  function createSelectOptions(jData) {
    if (!jData) return console.log("undefined.");
    let users = [];
    jData.forEach((jData) => {
      const option = document.createElement("option");
      option.value = jData.id;
      option.textContent = jData.name;
  
      users.push(option);
    });
    return users;
  }
  
  function toggleCommentSection(postId) {
    if (!postId) {
      return console.log("Post ID undefined or does not exist.");
    }
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) {
      return section;
      console.log("Section is undefined or does not exist.");
    }
    if (section) {
      section.classList.toggle("hide");
      return section;
    }
  
    //return section;
  }
  
  function toggleCommentButton(postId) {
    if (!postId) return;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (!button) return null;
  
    if ((button.textContent = button.textContent === "Show Comments")) {
      button.textContent = "Hide Comments";
      return button;
    } else {
      button.textContent = "Show Comments";
      return button;
    }
    return button;
  }
  
  function deleteChildElements(parentElement) {
    if (!parentElement?.tagName) return;
    let childElement = parentElement.lastElementChild;
  
    while (childElement) {
      parentElement.removeChild(childElement);
      childElement = parentElement.lastElementChild;
    }
  
    return parentElement;
  }
  
  function addButtonListeners() {
    const buttons = document.querySelector("main").querySelectorAll("button");
    if (!buttons) return;
  
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.addEventListener(
        "click",
        function (e) {
          toggleComments(e, postId);
        },
        false
      );
    });
  
    return buttons;
  }
  
  function removeButtonListeners() {
    const buttons = document.querySelector("main").querySelectorAll("button");
    if (!buttons) return;
  
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.removeEventListener(
        "click",
        function (e) {
          toggleComments(e, postId);
        },
        false
      );
    });
    return buttons;
  }
  
  function createComments(commentsData) {
    if (!commentsData) return;
  
    const fragment = document.createDocumentFragment();
  
    commentsData.forEach((comment) => {
      let articleElem = document.createElement("article");
      const h3 = createElemWithText("h3", comment.name);
      const p1 = createElemWithText("p", comment.body);
      const p2 = createElemWithText("p", `From: ${comment.email}`);
  
      articleElem.append(h3, p1, p2);
      fragment.append(articleElem);
    });
  
    return fragment;
  }
  
  function populateSelectMenu(jsonUser) {
    if (!jsonUser) return;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(jsonUser);
    for (let i = 0; i < options.length; i++) {
      let option = document.createElement("option");
      option = options[i];
      selectMenu.append(option);
    }
    return selectMenu;
  }
  
  const getUsers = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Status code not in 200-299 range");
      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  const getUserPosts = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      if (!res.ok) throw new Error("Status code not in 200-299 range");
      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  const getUser = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/users/" + userId
      );
      if (!res.ok) throw new Error("Status code not in 200-299 range");
      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  const getPostComments = async (postId) => {
    if (!postId) return;
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );
      if (!res.ok) throw new Error("Status code not in 200-299 range");
      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  const displayComments = async (postId) => {
    if (!postId) return;
    const sectionElem = document.createElement("section");
    sectionElem.dataset.postId = postId;
  
    sectionElem.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    sectionElem.append(fragment);
  
    return sectionElem;
  };
  
  const createPosts = async (posts) => {
    const fragment = document.createDocumentFragment();
    if (!posts) return;
  
    for (const post of posts) {
      let article = document.createElement("article");
  
      const h2 = createElemWithText("h2", post.title);
      const p1 = createElemWithText("p", post.body);
      const p4 = createElemWithText("p", `Post ID: ${post.id}`);
      const author = await getUser(post.userId);
      const p2 = createElemWithText(
        "p",
        `Author: ${author.name} with ${author.company.name}`
      );
      const p3 = createElemWithText("p", `${author.company.catchPhrase}`);
      const button = createElemWithText("button", "Show Comments");
      button.dataset.postId = post.id;
      article.append(h2, p1, p4, p2, p3, button);
  
      const section = await displayComments(post.id);
      article.append(section);
  
      fragment.append(article);
    }
  
    return fragment;
  };
  
  const displayPosts = async (posts) => {
    if (!posts) return document.querySelector(".default-text");
    let main = document.querySelector("main");
    let element = posts
      ? await createPosts(posts)
      : document.querySelector("main p");
    main.append(element);
    return element;
  };
  
  const toggleComments = (event, postId) => {
    if (!event || !postId) return;
    event.target.listener = true;
    let section = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);
  
    return [section, button];
  };
  
  const refreshPosts = async (posts) => {
    if (!posts) return;
    const main = document.querySelector("main");
    const buttons = removeButtonListeners();
    const mMain = deleteChildElements(main);
    const fragment = await displayPosts(posts);
    const button = addButtonListeners();
  
    return [buttons, mMain, fragment, button];
  };
  
  const selectMenuChangeEventHandler = async (e) => {
    if (!e) return;
    const userId = e?.target?.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
  
    return [userId, posts, refreshPostsArray];
  };
  const initPage = async () => {
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
  };
  function initApp() {
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler);
  }
  
  document.addEventListener("DOMContentLoaded", initApp, false);