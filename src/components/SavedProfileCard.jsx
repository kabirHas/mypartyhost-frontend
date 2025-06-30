import React from 'react'
import { Link } from 'react-router-dom'

function SavedProfileCard({ staff, index, handleRemove, loading }) {

  const inviteStaff = (staffId) => {
    // Logic to invite staff to a job
    console.log(`Inviting staff with ID: ${staffId}`);
  }

  return (
    <div
              key={staff._id + index}
              className="bg-white border md:w-[85%] border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-start gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold capitalize font-['Inter'] leading-normal">{staff.name}</h3>
                  <div className="text-sm text-right">
                    {staff.staffProfile?.baseRate && (
                      <div className="font-medium text-lg">Rate: ${staff.staffProfile.baseRate}/hr</div>
                    )}
                    <Link href={`/profile/${staff._id}`} className="text-[#E61E4D] no-underline font-medium hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 gap-1">
                  <i className="ri-star-fill text-yellow-500 text-base" />
                  <span className="font-medium text-yellow-500">{staff.averageRating || "0"}/5</span>
                  <Link to="#" className="underline justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight">
                    ({staff.reviews?.length || 0} Reviews)
                  </Link>
                </div>

                <div className="flex items-center text-sm text-[#656565] mt-1">
                  <i className="ri-map-pin-line mr-1 text-base" />
                  <span>{staff.city}, {staff.country}</span>
                </div>

                <p className="self-stretch justify-start text-[#656565] my-3 text-base font-normal font-['Inter'] leading-snug">{staff.bio || "No bio available."}</p>

                <p className="justify-start text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug mt-2">
                  <span className="font-semibold">Next Available:</span>{" "}
                  {staff.staffProfile.availableDates && staff.staffProfile.availableDates.length > 0
                    ? new Date(staff.staffProfile.availableDates[0]).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not available"}
                </p>

                <hr className="border-zinc-100 mt-4 border-2"  />

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleRemove(staff._id)}
                    className="px-4 py-2 border-1 border-[#E61E4D] text-[#E61E4D] rounded-lg hover:bg-[#E61E4D] hover:text-white text-sm flex items-center gap-1"
                    disabled={loading[staff._id]}
                  >
                    {loading[staff._id] ? (
                      "Removing..."
                    ) : (
                      <>
                        Remove From Shortlist <i className="ri-heart-fill text-red-500" />
                      </>
                    )}
                  </button>
                  <button onClick={() => inviteStaff(staff._id)} className="px-4 py-2 border-2 border-[#E61E4D] bg-gradient-to-l from-pink-600 to-rose-600 text-white rounded-lg text-sm hover:bg-[#E61E4D]">
                    Invite to Job
                  </button>
                </div>
              </div>
            </div>
  )
}

export default SavedProfileCard