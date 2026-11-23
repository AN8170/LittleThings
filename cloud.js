// The publishable key is intended for browser use. Never use a secret/service-role key here.
const recoveryLink = new URLSearchParams(location.hash.slice(1)).get('type') === 'recovery';
let passwordMode = null;
const client = window.supabase?.createClient('https://gesnwkfvrqsrecwvhbcm.supabase.co','sb_publishable_XzfL7Yi9Zctcx3NxaQKPDw_Zok9XC8c');
let activeUser = null, membership = null, refreshTimer = null, syncing = false, busy = false, generation=0, refreshRequest=0;
const cloud = {
  async getMembership(){return checked(await client.from('lt_members').select('couple_id,slot').maybeSingle())},
  async load(){const cid=membership.couple_id;const [c,w]=await Promise.all([client.from('lt_couples').select('*').eq('id',cid).single(),client.from('lt_wishes').select('*').eq('couple_id',cid).order('created_at',{ascending:false})]);return {couple:checked(c),wishes:checked(w)}},
  async saveWish(w, isEdit){const {id,name,owner,category,price,priority,link,notes,done}=w;const fields={name,owner,category,price:price===''?null:Number(price),priority,link,notes,done};const q=client.from('lt_wishes');checked(await (isEdit?q.update(fields).eq('id',id).eq('couple_id',membership.couple_id):q.insert({...fields,id,couple_id:membership.couple_id})).select('id').single())},
  async setDone(id,done){checked(await client.from('lt_wishes').update({done}).eq('id',id).eq('couple_id',membership.couple_id).select('id').single())},
  async remove(id){checked(await client.from('lt_wishes').delete().eq('id',id).eq('couple_id',membership.couple_id).select('id').single())},
  async settings(a,b,budget){checked(await client.from('lt_couples').update({name_a:a,name_b:b,budget:budget===''?null:Number(budget)}).eq('id',membership.couple_id).select('id').single())},
  async import(wishes){const rows=wishes.map(({name,owner,category,price,priority,link,notes,done})=>({id:crypto.randomUUID(),couple_id:membership.couple_id,name,owner,category,price:price===''?null:Number(price),priority,link,notes,done}));if(rows.length)checked(await client.from('lt_wishes').insert(rows))}
};
function checked(result){if(result.error)throw new Error(result.error.message);return result.data}
function status(message){$('accessStatus').textContent=message}
function gate(mode){$('accessPanel').hidden=mode==='app';$('wishlistApp').hidden=mode!=='app';$('navActions').hidden=mode!=='app';$('signOut').hidden=!activeUser;$('authForm').hidden=mode!=='auth';$('pairForm').hidden=mode!=='pair';$('retry').hidden=mode!=='error';$('forgotForm').hidden=mode!=='forgot';$('resetForm').hidden=mode!=='reset';$('changePassword').hidden=mode!=='app';$('cancelChange').hidden=passwordMode!=='change';if(mode!=='app')for(const d of document.querySelectorAll('dialog[open]'))d.close()}
function stopSync(){clearInterval(refreshTimer);refreshTimer=null}
async function refresh(force=false){if(!membership||(!force&&(syncing||busy)))return;const run=generation, request=++refreshRequest;syncing=true;try{const {couple,wishes}=await cloud.load();if(run!==generation||request!==refreshRequest)return;state=normalize({people:[couple.name_a,couple.name_b],budget:couple.budget,wishes});render();const waiting=membership.slot==='a'&&!!couple.invite_code;$('pairBanner').hidden=!waiting;$('inviteCode').textContent=waiting?couple.invite_code:'';$('inviteMessage').textContent=waiting&&Date.parse(couple.invite_expires_at)<=Date.now()?'This code has expired. Generate a new one.':'Share this private, single-use code with your partner. It expires after 7 days.';$('syncStatus').textContent='Saved to your shared wishlist · '+new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});return true}catch(err){if(run===generation&&request===refreshRequest)$('syncStatus').textContent='Could not sync: '+err.message;return false}finally{if(request===refreshRequest)syncing=false}}
async function enter(session){if(passwordMode&&session?.user)return;const run=++generation;stopSync();membership=null;activeUser=session?.user||null;state={people:['You','Partner'],budget:'',wishes:[]};render();if(!activeUser){gate('auth');status('Sign in to access your private holiday wishlist.');return}gate('loading');status('Loading your shared wishlist…');try{const m=await cloud.getMembership();if(run!==generation)return;membership=m;if(!m){gate('pair');status('Create a wishlist for two or enter your partner’s invitation code.');return}if(!await refresh(true))throw Error('Cannot load your wishlist. Check that setup.sql has been run in Supabase.');if(run!==generation)return;gate('app');refreshTimer=setInterval(()=>refresh(),5000)}catch(e){if(run===generation){gate('error');status(e.message)}}}
async function action(fn){if(busy)return;busy=true;try{await fn();return true}catch(e){toast(e.message);return false}finally{busy=false}}
async function mutate(fn){if(!membership)return false;const ok=await action(fn);if(ok)await refresh(true);return ok}
function initCloud(){if(!client){gate('error');status('The database library could not load. Check your internet connection.');return}let current=null;
  client.auth.onAuthStateChange((event,session)=>{
    const id=session?.user?.id||null;
    if(event==='PASSWORD_RECOVERY'||(event==='INITIAL_SESSION'&&recoveryLink&&session?.user)){
      current=id; passwordMode='recovery';
      ++generation; stopSync(); membership=null; activeUser=session.user;
      gate('reset'); status('Choose a new password for your Little Things account.');
      return;
    }
    if(event==='SIGNED_OUT'){passwordMode=null;current=null;setTimeout(()=>enter(null),0);return;}
    if(passwordMode)return;
    if(event==='INITIAL_SESSION'||id!==current){current=id;setTimeout(()=>enter(session),0)}
  });
  $('forgotPassword').onclick=()=>{$('recoveryEmail').value=$('email').value;gate('forgot');status('Enter your account email to receive a password reset link.');};
  $('backToLogin').onclick=()=>{gate('auth');status('Sign in to access your private holiday wishlist.');};
  $('forgotForm').onsubmit=async e=>{e.preventDefault();await action(async()=>{checked(await client.auth.resetPasswordForEmail($('recoveryEmail').value.trim(),{redirectTo:location.origin+location.pathname}));status('If an account exists, a password reset link will arrive in your inbox.');});};
  $('changePassword').onclick=()=>{passwordMode='change';++generation;stopSync();$('resetForm').reset();gate('reset');status('Choose a new password for your account.');};
  $('cancelChange').onclick=async()=>{passwordMode=null;$('resetForm').reset();await enter(checked(await client.auth.getSession()).session);};
  $('resetForm').onsubmit=async e=>{
    e.preventDefault();const password=$('newPassword').value;
    if(password!==$('confirmPassword').value){status('The passwords do not match.');return;}
    if(await action(async()=>{checked(await client.auth.updateUser({password}));})){
      passwordMode=null;$('resetForm').reset();toast('Password updated successfully!');
      await enter(checked(await client.auth.getSession()).session);
    }
  };$('authForm').onsubmit=async e=>{e.preventDefault();await action(async()=>{checked(await client.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value}));$('password').value=''})};$('signup').onclick=async()=>{if(!$('authForm').reportValidity())return;await action(async()=>{const result=checked(await client.auth.signUp({email:$('email').value.trim(),password:$('password').value,options:{emailRedirectTo:location.origin+location.pathname}}));$('password').value='';if(!result.session)status('Check your email to confirm your account, then sign in.')})};$('pairForm').onsubmit=async e=>{e.preventDefault();if(await action(async()=>checked(await client.rpc('lt_create_couple',{p_name:$('pairName').value.trim()}))))await enter(checked(await client.auth.getSession()).session)};$('join').onclick=async()=>{if(!$('pairForm').reportValidity())return;const code=$('pairCode').value.trim();if(!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(code)){toast('Enter the full invitation code');return}if(await action(async()=>checked(await client.rpc('lt_join_couple',{p_name:$('pairName').value.trim(),p_code:code})))){ $('pairCode').value='';await enter(checked(await client.auth.getSession()).session)}};$('signOut').onclick=async()=>{await action(async()=>checked(await client.auth.signOut()))};$('copyInvite').onclick=async()=>{try{await navigator.clipboard.writeText($('inviteCode').textContent);toast('Invitation code copied')}catch{toast('Select and copy the invitation code manually')}};$('renewInvite').onclick=()=>mutate(async()=>checked(await client.rpc('lt_refresh_invite')));$('retry').onclick=async()=>{try{await enter(checked(await client.auth.getSession()).session)}catch(e){status(e.message)}};document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()})}
