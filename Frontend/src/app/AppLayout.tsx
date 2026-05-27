import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PremiumSplash } from "../components/ui/PremiumSplash";
import { AuthPanel } from "../components/auth/AuthPanel";
import { Composer } from "../components/feed/Composer";
import { FeedList } from "../components/feed/FeedList";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { EventsView, ExploreView, GroupsView, ProfileView } from "../components/entities/EntityViews";
import { ProfileDrawer } from "../components/ui/ProfileDrawer";
import type { ViewId } from "../config/navigation";
import { useAuth } from "../hooks/useAuth";
import { useCatalogs } from "../hooks/useCatalogs";
import { useEntityActions } from "../hooks/useEntityActions";
import { useEvents } from "../hooks/useEvents";
import { useFeed } from "../hooks/useFeed";
import { useGraphSnapshot } from "../hooks/useGraphSnapshot";
import { useGroups } from "../hooks/useGroups";
import { useUserSuggestions } from "../hooks/useUserSuggestions";
import { useTheme } from "../hooks/useTheme";
import { useUserSocialSummary } from "../hooks/useUserSocialSummary";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { updateProfile } from "../services/userService";

export default function AppLayout({ activeView, setActiveView }: { activeView: string; setActiveView: (v: string) => void }) {
  const { theme, toggleTheme } = useTheme();
  const { authLoading, authMessage, isLoggedIn, refreshSession, sessionUser, signIn, signOut, signUp, token } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [publicProfileId, setPublicProfileId] = useState<string | null>(null);

  const contentAreaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (contentAreaRef.current) {
      gsap.fromTo(
        contentAreaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );
    }
  }, [activeView]);

  const { feedLoading, feedMessage, posts, publishPost, publishing, reactingPostId, refreshFeed, shareExistingPost, toggleReaction, toggleSaved } = useFeed(sessionUser?.id, token);
  const { followingId, followSuggestion, loadingSuggestions, suggestions } = useUserSuggestions(token, refreshFeed);
  const { refreshGraph, snapshot } = useGraphSnapshot();
  const { refreshSocial, social, socialLoading, socialMessage } = useUserSocialSummary(token);
  const { addCity, addHashtag, categories, cities, hashtags } = useCatalogs(token);
  const { groups, refreshGroups } = useGroups();
  const { events, refreshEvents } = useEvents();

  const {
    addEvent,
    addGroup,
    attendExistingEvent,
    blockExistingUser,
    connectProfileCities,
    joinExistingGroup,
    saveExistingEvent,
  } = useEntityActions(
    token,
    refreshGraph,
    refreshFeed,
    refreshSocial,
    refreshGroups,
    refreshEvents,
  );

  const { profile, profileLoading } = usePublicProfile(publicProfileId || undefined);

  useEffect(() => {
    if (!isLoggedIn) return;

    queueMicrotask(() => setShowAuthModal(false));
  }, [isLoggedIn]);

  async function handlePublish(input: Parameters<typeof publishPost>[0]) {
    const success = await publishPost(input);

    if (success) {
      await Promise.all([refreshFeed(), refreshGraph(), refreshSocial()]);
    }

    return success;
  }

  async function handleUpdateProfile(input: {
    apellido?: string;
    bio?: string;
    foto_perfil_url?: string;
    nombre?: string;
  }) {
    if (!token) return false;
    await updateProfile(token, input);
    await Promise.all([refreshSession(), refreshSocial(), refreshGraph(), refreshFeed()]);
    return true;
  }

  async function handleFollowUser(userId: string) {
    await followSuggestion(userId);
    return true;
  }

  return (
    <div className={`app-container ${theme}`}>
      <PremiumSplash />
      <Sidebar
        activeView={activeView as ViewId}
        onNavigate={(view) => {
          setActiveView(view);
          setPublicProfileId(null);
        }}
        token={token}
        sessionUser={sessionUser}
        suggestions={suggestions}
        loadingSuggestions={loadingSuggestions}
        onFollow={followSuggestion}
        followingId={followingId}
      />
      <main className="app-main">
        <Topbar
          activeView={activeView as ViewId}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => {
            setAuthMode("login");
            setShowAuthModal(true);
          }}
          onRegisterClick={() => {
            setAuthMode("register");
            setShowAuthModal(true);
          }}
          onSignOut={signOut}
          sessionUser={sessionUser}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <div className="content-area" ref={contentAreaRef}>
          {activeView === "inicio" && (
            <div className="feed-container">
              <Composer
                cities={cities}
                isLoggedIn={isLoggedIn}
                isPublishing={publishing}
                user={sessionUser}
                onPublish={handlePublish}
              />
              <FeedList
                posts={posts}
                isLoading={feedLoading}
                message={feedMessage}
                onCommentCreated={refreshFeed}
                onOpenUser={setPublicProfileId}
                onSharePost={shareExistingPost}
                onToggleSaved={toggleSaved}
                onToggleReaction={toggleReaction}
                reactingPostId={reactingPostId}
                token={token}
              />
            </div>
          )}

          {activeView === "explorar" && (
            <ExploreView cities={cities} feedPosts={posts} hashtags={hashtags} onOpenUser={setPublicProfileId} snapshot={snapshot} />
          )}

          {activeView === "grupos" && (
            <GroupsView
              groups={groups}
              myGroups={social?.grupos ?? []}
              onCreateGroup={addGroup}
              onJoinGroup={joinExistingGroup}
              token={token}
            />
          )}

          {activeView === "eventos" && (
            <EventsView
              cities={cities}
              events={events}
              onAttendEvent={attendExistingEvent}
              onCreateEvent={addEvent}
              onSaveEvent={saveExistingEvent}
              social={social}
              token={token}
            />
          )}

          {activeView === "perfil" && (
            <ProfileView
              categories={categories}
              cities={cities}
              onBlockUser={blockExistingUser}
              onConnectProfileCities={connectProfileCities}
              onCreateCity={addCity}
              onCreateHashtag={addHashtag}
              onUpdateProfile={handleUpdateProfile}
              snapshot={snapshot}
              social={social}
              socialLoading={socialLoading}
              socialMessage={socialMessage}
              token={token}
            />
          )}

        </div>
      </main>

      {/* Sliding profile drawer — rendered outside content-area so it overlays everything */}
      <ProfileDrawer
        isOpen={!!publicProfileId}
        isLoading={profileLoading}
        onClose={() => setPublicProfileId(null)}
        onFollow={handleFollowUser}
        profileId={publicProfileId}
        social={profile}
        token={token}
      />

      {showAuthModal && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setShowAuthModal(false)}>
              Cerrar
            </button>
            <AuthPanel
              authLoading={authLoading}
              authMessage={authMode === "register" && authMessage ? authMessage : authMessage}
              isLoggedIn={isLoggedIn}
              user={sessionUser}
              onLogin={signIn}
              onLogout={signOut}
              onRegister={signUp}
            />
          </div>
        </div>
      )}
    </div>
  );
}
