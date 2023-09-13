# backend

### How supabase subtree was setup
> Subtree changes are part of the main repo history
```sh
# add as subtree at services/backend/supabase and contain it all in one commit
git subtree add --prefix .\services\backend\supabase https://github.com/supabase/supabase.git master --squash
```

> See `package.json` scripts for how to push to a custom remote and also pull from both custom and original remote