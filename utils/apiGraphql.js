const apiGraphQLgetAllUsers = async (query) => {
    const response = await fetch(`/concorsi/graphql`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        // Se usi autenticazione (es. token Bearer), includi anche questo header
        // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        body: JSON.stringify({
        query: query,
        }),
    });
    console.log("||||||||||||||||||||||||||||query graphql",query)
    const data = await response.json();
    //console.log(data);
    return data
 };

export {
    apiGraphQLgetAllUsers
  };