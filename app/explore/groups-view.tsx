import Button from '@/components/Button';
import BottomSheet from '@/components/BottomSheet';
import { BackButton } from '@/components/custom/BackButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedIcons from '@/components/ThemedIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Group, GroupMember, groupsApiService } from '@/services/groupsApiService';
import { useSession } from '@/context/SessionContext';
import { useState, useEffect } from 'react';
import OptionsPopup from '@/components/OptionsPopup';
import { getItinerariesById } from '@/services/itinerariesApiService';
import ViewItinerary from '@/components/custom/ViewItinerary';
import EmptyMessage from '@/components/EmptyMessage';

export default function GroupView() {
  const params = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');
  const accentColor = useThemeColor({}, 'accent');
  const { session } = useSession();
  const [selectedButton, setSelectedButton] = useState('members');
  const [itineraryData, setItineraryData] = useState(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  // Parse the group data from params
  const groupData: Group = params.groupData ? JSON.parse(params.groupData as string) : null;

  // Function to fetch itinerary data
  const fetchItinerary = async () => {
    if (!groupData.itineraryID || !session?.accessToken) return;
    
    setLoadingItinerary(true);
    try {
      const result = await getItinerariesById(groupData.itineraryID, session.accessToken);
      if (result.success) {
        setItineraryData(result.data);
      } else {
        console.error('Failed to fetch itinerary:', result.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    } finally {
      setLoadingItinerary(false);
    }
  };

  // Handle button selection and fetch itinerary if needed
  const handleButtonPress = (buttonType: string) => {
    setSelectedButton(buttonType);
    if (buttonType === 'itinerary' && groupData.itineraryID && !itineraryData) {
      fetchItinerary();
    }
  };

  // Handle join request response (approve/reject)
  const handleJoinRequestResponse = async (userID: string, response: boolean) => {
    if (!session?.accessToken || !session?.user?.id) return;
    
    const member = groupData.members.find(m => m.userID === userID);
    const memberName = member?.name || 'User';
    
    Alert.alert(
      `${response ? 'Approve' : 'Reject'} Member`,
      `Are you sure you want to ${response ? 'approve' : 'reject'} ${memberName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: response ? 'Approve' : 'Reject',
          style: response ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await groupsApiService.respondJoinRequest(session.accessToken!, {
                groupID: groupData.id!,
                userID: userID,
                adminID: session.user!.id,
                response: response
              });
              
              // Update local state to reflect the change
              if (response) {
                // Approve: move from pending to approved
                const updatedMembers = groupData.members.map(m => 
                  m.userID === userID ? { ...m, isApproved: true } : m
                );
                Object.assign(groupData, { members: updatedMembers });
              } else {
                // Reject: remove from members array
                const updatedMembers = groupData.members.filter(m => m.userID !== userID);
                Object.assign(groupData, { members: updatedMembers });
              }
              
              // Force re-render by updating a state variable
              setSelectedButton(selectedButton); // Trigger re-render
              
              Alert.alert(
                'Success',
                `${memberName} has been ${response ? 'approved' : 'rejected'} successfully.`
              );
            } catch (error) {
              console.error('Error responding to join request:', error);
              Alert.alert(
                'Error',
                'Failed to respond to join request. Please try again.'
              );
            }
          }
        }
      ]
    );
  };
  
  if (!groupData) {
    return (
      <ThemedView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ThemedText>Group data not found</ThemedText>
      </ThemedView>
    );
  }

  const isAdmin = groupData.admins.includes(session?.user?.id || '');
  const currentUserMember = groupData.members.find(m => m.userID === session?.user?.id);
  const approvedMembers = groupData.members.filter(m => m.isApproved);
  const pendingMembers = groupData.members.filter(m => !m.isApproved);

  const renderMemberItem = (member: GroupMember, isPending: boolean = false) => (
    <View key={member.userID} style={styles.memberItem}>
      <Image
        source={{ uri: member.profileImage || 'https://ui-avatars.com/api/?name=User' }}
        style={styles.memberImage}
      />
      <View style={styles.memberInfo}>
        <ThemedText type="defaultSemiBold">{member.name}</ThemedText>
        <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>@{member.username}</ThemedText>
        {isAdmin ? (<>
          <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>Admin</ThemedText>
          </>):(<>
            <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>Member</ThemedText>
          </>)}
      </View>
      {isPending && isAdmin && (
        <>
          <TouchableOpacity 
            style={{padding: 5}}
            onPress={() => handleJoinRequestResponse(member.userID, false)}
          >
            <ThemedIcons library="MaterialIcons" name="close" size={27} color="red"/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{padding: 5}}
            onPress={() => handleJoinRequestResponse(member.userID, true)}
          >
            <ThemedIcons library="MaterialIcons" name="check" size={27} color="green"/>
          </TouchableOpacity>
        
        </>
      )}

      {!isPending && currentUserMember && (
        <OptionsPopup options={[
          <TouchableOpacity style={styles.options}>
            <ThemedIcons library="MaterialIcons" name="history" size={20} />
            <ThemedText>View History</ThemedText>
          </TouchableOpacity>,
          <TouchableOpacity style={styles.options}>
          <ThemedIcons library="MaterialIcons" name="settings" size={20} />
          <ThemedText>Route Settings</ThemedText>
        </TouchableOpacity>,
        ]}> 
          <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={22} color="#222" />
        </OptionsPopup>
      )}

    </View>
  );

  return (
    <ThemedView style={{flex: 1}}>
      <BackButton type='floating' />
      
      <BottomSheet snapPoints={[0.3, 0.6, 0.9]} defaultIndex={1}>
        { isAdmin ? (
          <OptionsPopup options={[
            <TouchableOpacity style={styles.options}>
              <ThemedIcons library="MaterialIcons" name="history" size={20} />
              <ThemedText>View History</ThemedText>
            </TouchableOpacity>,
            <TouchableOpacity style={styles.options}>
            <ThemedIcons library="MaterialIcons" name="settings" size={20} />
            <ThemedText>Route Settings</ThemedText>
          </TouchableOpacity>,
          ]} style={styles.optionsButton}> 
            <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={22} color="#222" />
          </OptionsPopup>
        ):(
          <>
          
          </>
        )}
        

        <ScrollView>
          <View style={styles.groupHeader}>
            <View style={styles.groupTitleSection}>
              <ThemedText type="title">{groupData.name}</ThemedText>
              <View style={styles.groupStats}>
                <View style={styles.statItem}>
                  <ThemedIcons library='MaterialIcons' name='code' size={16} />
                  <ThemedText style={styles.statText}>Invite Code: {groupData.inviteCode}</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedIcons library='MaterialIcons' name='group' size={16} />
                  <ThemedText style={styles.statText}>
                    {approvedMembers.length} member{approvedMembers.length !== 1 ? 's' : ''}
                  </ThemedText>
                </View>
              </View>
            </View>

            

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, {backgroundColor: selectedButton === 'members' ? accentColor : backgroundColor}]} onPress={() => handleButtonPress('members')}>
                <ThemedText>Members</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {backgroundColor: selectedButton === 'itinerary' ? accentColor : backgroundColor}]} onPress={() => handleButtonPress('itinerary')}>
                <ThemedText>Itinerary</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {backgroundColor: selectedButton === 'chat' ? accentColor : backgroundColor}]} onPress={() => handleButtonPress('chat')}>
                <ThemedText>Chat</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1}}>
            {selectedButton === 'members' && (
              <>
                {approvedMembers.map(member => renderMemberItem(member))}
              
                {pendingMembers.length > 0 && (
                  <>
                    <ThemedText type="defaultSemiBold" style={{ marginTop: 20, marginBottom: 10, opacity: 0.7 }}>
                      Pending Approval ({pendingMembers.length})
                    </ThemedText>
                    {pendingMembers.map(member => renderMemberItem(member, true))}
                  </>
                )}
              </>
            )}

            {selectedButton === 'itinerary' && (
              <>
                {groupData.itineraryID ? (
                  <View>
                    {loadingItinerary ? (
                      <ActivityIndicator size="small" />
                    ) : itineraryData ? (
                      <View style={styles.itineraryContainer}>
                        <ViewItinerary json={itineraryData} />
                      </View>
                      
                    ) : (
                      <EmptyMessage iconLibrary='MaterialDesignIcons' iconName='note-remove'
                      title='Error Loading Itinerary'
                      description="Failed to load itinerary details."
                      />
                    )}
                  </View>
                ) : (
                  <EmptyMessage iconLibrary='MaterialDesignIcons' iconName='note-remove'
                  title='No Itinerary Linked'
                  description="This group doesn't have an associated itinerary yet."
                  />
                )}
              </>
            )}
            
          </View>

          
        </ScrollView>
        
      </BottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  groupHeader: {
    paddingBottom: 15,
    marginBottom: 20,
  },
  groupTitleSection: {
    marginBottom: 15,
  },
  groupStats: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    opacity: 0.7,
  },
  inviteCodeContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  memberImage:{
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 15
  },
  memberInfo: {
    flex: 1,
  },
  buttonRow:{
    flexDirection: 'row',
    gap: 10,
  },
  button:{
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsButton:{
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 5,
    zIndex: 100
  },
  options:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itineraryContainer:{
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  }
});